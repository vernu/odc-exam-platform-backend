import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InitialAdminSetupDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async initialAdminSetup(adminData: InitialAdminSetupDTO) {
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
        newUser,
        accessToken: '',
      };
    } catch (e) {
      throw new HttpException({}, 500);
    }
  }
}
