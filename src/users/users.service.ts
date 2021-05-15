import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterExaminerResponseDTO } from './dto/user.dto';
import { MailService } from '../mail/mail.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationsService: OrganizationsService,
  ) {}

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async findUserByEmail(email: string, selectPassword = false) {
    if (selectPassword) {
      return await this.userModel.findOne({ email }).select('+password');
    }
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
      this.mailService.sendEmailFromTemplate({
        to: email,
        subject: `Welcome to ${process.env.APP_NAME || 'ODC'}`,
        template: 'new-user-welcome',
        context: {
          name,
          email,
          password,
          role,
        },
      });
      return await newUser.save();
    }
  }
}
