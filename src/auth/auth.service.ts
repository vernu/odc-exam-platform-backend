import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  InitialSuperAdminSetupDTO,
  LoginDTO,
  ResetPasswordDTO,
  ValidatePasswordResetSecretCodeDTO,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { MailService } from '../mail/mail.service';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
@Injectable({ scope: Scope.REQUEST })
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private organizationsService: OrganizationsService,
    private mailService: MailService,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async initialSuperAdminSetup(
    adminData: InitialSuperAdminSetupDTO,
  ): Promise<any> {
    //check if there are no users in the db before initializing a super-admin account
    const anyUser = await this.userModel.findOne();
    if (anyUser) {
      throw new HttpException(
        {
          success: false,
          error: "can't create a super-admin account, users exist in the db",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const { name, email, password } = adminData;

    try {
      const newUser = await this.usersService.createUser({
        name,
        email,
        password,
        role: 'super-admin',
      });
      const payload = { userId: newUser._id, email: newUser.email };
      const accessToken = this.jwtService.sign(payload);
      return {
        user: await this.usersService.findUser({ email }),
        accessToken,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: e.toString(),
        },
        500,
      );
    }
  }

  async login(credentials: LoginDTO): Promise<any> {
    const { email, password } = credentials;
    if (email == null || password == null) {
      throw new HttpException(
        {
          success: false,
          error: 'email and password  is required',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findUser({ email }, true);

    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'wrong credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const payload = { userId: user._id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        var res = {
          accessToken,
          user: await this.usersService.findUser({ email }),
        };

        //if user's role is organization-admin or examiner include list of organizations associated with the user in the response
        if (['organization-admin', 'examiner'].includes(user.role)) {
          const organizations = await this.organizationsService.findOrganizations(
            { $or: [{ examiners: user._id }, { admin: user._id }] },
          );

          if (organizations.length == 0) {
            throw new HttpException(
              {
                success: false,
                error:
                  'your account is not associated with any organization yet',
              },
              HttpStatus.UNAUTHORIZED,
            );
          }
          return { ...res, organizations };
        }
        return res;
      } else {
        throw new HttpException(
          {
            success: false,
            error: 'wrong credentials',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async requestPasswordReset(resetPasswordDTO: ResetPasswordDTO): Promise<any> {
    const { email } = resetPasswordDTO;
    const user = await this.usersService.findUser({ email });
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const secretCode = this.getRandomInt(100000, 999000).toString(); // six digit random num
    const hashedSecretCode = await bcrypt.hash(secretCode, 10);

    const payload = {
      userId: user._id,
      email: user.email,
      secretCode: hashedSecretCode,
      pwResetToken: true,
    };
    const resetToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const passwordReset = new this.passwordResetModel({
      user,
      secretCode: hashedSecretCode,
      expiresAt: Date.now() + 1 / 24,
    });

    await passwordReset.save();

    console.log(`secretCode: ${secretCode}`);
    console.log(`resetToken: ${resetToken}`);

    this.mailService.sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<h3>Hi ${user.name},</h3>you have requested to to reset your password<br> 
      your secrete code is <b>${secretCode}</b><br>
      you can also  click this link to continue http://FRONTEND.URL/reset-password?token=${resetToken}<br> 
      <hr>note that the code expires in 1 hour`,
    });

    return `A password reset email has been sent to  ${user.email}, Please check your email. Note that it will expire in 1 hour`;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async validatePasswordResetSecretCode(
    validatePasswordResetSecretCodeDTO: ValidatePasswordResetSecretCodeDTO,
  ) {
    const { email, secretCode } = validatePasswordResetSecretCodeDTO;

    if (!secretCode) {
      throw new HttpException(
        {
          success: false,
          error: 'secretCode is missing',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.findUser({ email }, true);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordReset = await this.passwordResetModel
      .findOne()
      .sort({
        createdAt: -1,
      })
      .where({ user: user._id, usedAt: null });
    console.log(passwordReset);
    if (!passwordReset) {
      throw new HttpException(
        {
          success: false,
          error: 'please request password reset first',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!(await bcrypt.compare(secretCode, passwordReset.secretCode))) {
      throw new HttpException(
        {
          success: false,
          error: 'invalid secret code',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return 'secret code is valid';
    }
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<any> {
    const { email, secretCode, resetToken, newPassword } = resetPasswordDTO;

    if (!secretCode && !resetToken) {
      throw new HttpException(
        {
          success: false,
          error: 'secretCode or resetToken is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.findUser({ email }, true);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!newPassword) {
      throw new HttpException(
        {
          success: false,
          error: 'new password is required to continue',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    var passwordReset = null;
    if (secretCode) {
      passwordReset = await this.passwordResetModel
        .findOne()
        .sort({
          createdAt: -1,
        })
        .where({ user: user._id, usedAt: null });
      console.log(passwordReset);
      if (!passwordReset) {
        throw new HttpException(
          {
            success: false,
            error: 'please request password reset first',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (!(await bcrypt.compare(secretCode, passwordReset.secretCode))) {
          throw new HttpException(
            {
              success: false,
              error: 'invalid secret code',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } else if (resetToken) {
      const payload = await this.jwtService.verify(resetToken, {
        ignoreExpiration: true,
      });
      console.log(payload);
      passwordReset = await this.passwordResetModel
        .findOne()
        .sort({
          createdAt: -1,
        })
        .where({
          user: user._id,
          secretCode: payload.secretCode,
          usedAt: null,
        });
      if (!passwordReset) {
        throw new HttpException(
          {
            success: false,
            error: 'invalid token, please request password reset again',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.updateOne({ password: hashedPassword });
    await passwordReset.updateOne({ usedAt: new Date() });
    return 'your password has been reset successfully';
  }

  async changePassword({ currentPassword, newPassword }) {
    const currentUser = this.request.user;
    const user = await this.userModel.findOne(currentUser).select('password');
    if (await bcrypt.compare(currentPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.updateOne({
        password: hashedPassword,
      });
    } else {
      throw new HttpException(
        {
          success: true,
          error: 'wrong password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
