import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  InitialSuperAdminSetupDTO,
  InitialSuperAdminSetupResponsDTO,
  LoginDTO,
  LoginResponseDTO,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private organizationsService: OrganizationsService,
  ) {}

  async initialSuperAdminSetup(
    adminData: InitialSuperAdminSetupDTO,
  ): Promise<InitialSuperAdminSetupResponsDTO> {
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
    const user = await this.usersService.findUserByEmail(email);

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
          success: true,
          message: 'logged in successfully',
          accessToken,
          user,
        };
        if(user.role === 'organization-admin'){
          const organizations = await this.organizationsService.findOrganizationByAdmin(user._id);
          return {...res, ...{organizations}}
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
}
