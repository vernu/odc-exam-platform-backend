import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  CreateOrganizationDTO,
  CreateOrganizationResponseDTO,
} from './dto/organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}
  async createOrganization(
    organizationInfo: CreateOrganizationDTO,
  ): Promise<CreateOrganizationResponseDTO> {
    const userExists = await this.userModel.findOne({
      email: organizationInfo.adminEmail,
    });

    if (userExists) {
      throw new HttpException(
        {
          success: false,
          error: 'user with  the same email exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const password = Math.random().toString(36).substring(5); //random pw
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        name: organizationInfo.adminName,
        email: organizationInfo.adminEmail,
        password: hashedPassword,
      });

      try {
        await newUser.save();

        const newOrganization = new this.organizationModel({
          name: organizationInfo.organizationName,
          description: organizationInfo.organizationDescription,
          admin: newUser,
        });
        await newOrganization.save();
        return {
          success: true,
          message: 'Organizer has been added',
          organization: newOrganization,
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

    const newOrganization = new this.organizationModel({});
  }
}
