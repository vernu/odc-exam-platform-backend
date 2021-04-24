import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import {
  InitialAdminSetupDTO,
  InitialAdminSetupResponsDTO,
  LoginDTO,
  LoginResponseDTO,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async initialAdminSetup(
    adminData: InitialAdminSetupDTO,
  ): Promise<InitialAdminSetupResponsDTO> {
    const adminExists = await this.userModel.findOne({ role: 'admin' });
    if (adminExists) {
      throw new HttpException(
        {
          success: false,
          error: 'Admin account has already been setup',
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
      role: 'admin',
    });
    try {
      newUser.save();
      return {
        success: true,
        user: newUser,
        accessToken: '',
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: e,
        },
        500,
      );
    }
  }

  async login(credentials: LoginDTO): Promise<any> {
    const { email, password } = credentials;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (await bcrypt.compare(password, user.password)) {
        return {
          success: true,
          message: 'logged in successfully',
          user,
          accessToken: '',
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
