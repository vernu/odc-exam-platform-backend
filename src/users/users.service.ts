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
import { UpdateUserDTO } from './dto/user.dto';
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

  async findUser(user, selectPassword = false) {
    if (selectPassword) {
      return await this.userModel.findOne(user).select('+password');
    }
    return await this.userModel.findOne(user);
  }

  generateRandomPassword(): string {
    return Math.random().toString(36).substring(5); //random pw
  }

  async createUser({ name, email, password, role }): Promise<UserDocument> {
    if (await this.findUser({ email })) {
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

  async updateUser(userId: string, updateUserDTO: UpdateUserDTO) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException(
        { success: false, error: 'not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    user.name = updateUserDTO.name || user.name;
    user.email = updateUserDTO.email || user.email;
    await user.save();
    return user;
  }
}
