import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  InitialSuperAdminSetupDTO,
  InitialSuperAdminSetupResponsDTO,
  LoginDTO,
  LoginResponseDTO,
  ResetPasswordDTO,
  ResetPasswordResponseDTO,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { MailService } from 'src/mail/mail.service';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';

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
        user: await this.usersService.findUserByEmail(email),
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
    const user = await this.usersService.findUserByEmail(email, true);

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
          user: await this.usersService.findUserByEmail(email),
        };
        if (user.role === 'organization-admin') {
          const organizations = await this.organizationsService.findOrganizationByAdmin(
            user._id,
          );
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
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // const payload = {
    //   userId: user._id,
    //   email: user.email,
    //   pwReset: true,
    // };
    // const resetToken = this.jwtService.sign(payload, {
    //   expiresIn: '1h',
    // });

    const secretCode = this.getRandomInt(100000, 999000); // six digit random num

    const passwordReset = new this.passwordResetModel({
      user,
      secretCode,
      expiresAt: Date.now() + 1 / 24,
    });

    await passwordReset.save();

    console.log(passwordReset);

    this.mailService.sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<h3>Hi ${user.name},</h3>you have requested to to reset your password<br> your secrete code is <b>${secretCode}</b>  <hr>note that the code expires in 1 hour`,
    });

    return {
      success: true,
      message: `a password reset secrete code has been sent to  ${user.email}, it will expire in 1 hour`,
    };
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<any> {
    const { email, secretCode, newPassword } = resetPasswordDTO;
  }
}
