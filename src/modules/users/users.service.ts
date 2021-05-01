import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterExaminerResponseDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async registerExaminer(examinerData): Promise<RegisterExaminerResponseDTO> {
    const { name, email } = examinerData;

    const userExists = await this.findUserByEmail(email);
    if (userExists) {
      throw new HttpException(
        {
          success: false,
          error: 'email already taken',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const password = this.generateRandomPassword();

    try {
      const newExaminer = await this.createUser({
        name,
        email,
        role: 'examiner',
        password,
      });
      this.sendCredentialsToNewExaminerViaEmail(name, email, password);
      return {
        success: true,
        user: newExaminer,
        message: 'Examiner account created successfully',
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

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  generateRandomPassword(): string {
    return Math.random().toString(36).substring(5); //random pw
  }

  async createUser({ name, email, password, role }): Promise<UserDocument> {
    if (await this.findUserByEmail(email)) {
      throw new HttpException(
        { success: false, error: 'user exists with the same email' },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        name,
        email,
        role,
        password: hashedPassword,
      });
      return await newUser.save();
    }
  }

  sendCredentialsToNewExaminerViaEmail(
    name: string,
    email: string,
    password: string,
  ) {
    // console.log({ name, email, password });
  }
}
