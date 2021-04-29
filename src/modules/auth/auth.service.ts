import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import {
  InitialSuperAdminSetupDTO,
  InitialSuperAdminSetupResponsDTO,
  LoginDTO,
  LoginResponseDTO,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async initialSuperAdminSetup(
    adminData: InitialSuperAdminSetupDTO,
  ): Promise<InitialSuperAdminSetupResponsDTO> {
    const adminExists = await this.userModel.findOne({ role: 'super-admin' });
    if (adminExists) {
      throw new HttpException(
        {
          success: false,
          error: 'SuperAdmin account has already been setup',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const { name, email, password } = adminData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: 'super-admin',
    });
    try {
      await newUser.save();
      const payload = { userId: newUser._id, email: newUser.email };
      const accessToken = this.jwtService.sign(payload);
      return {
        success: true,
        user: newUser,
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

  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
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
    const user = await this.userModel.findOne({ email });

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
        return {
          success: true,
          message: 'logged in successfully',
          user,
          accessToken,
        };
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
}
