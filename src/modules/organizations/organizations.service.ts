import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  CreateOrganizationDTO,
  CreateOrganizationResponseDTO,
  DeleteOrganizationResponseDTO,
  ShowOrganizationsResponseDTO,
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

  async showOrganizations(): Promise<ShowOrganizationsResponseDTO> {
    try {
      const organizations = await this.organizationModel
        .find()
        .populate(['admin']);
      return {
        success: true,
        count: organizations.length,
        organizations,
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
  }
  async deleteOrganization(
    organizationId: string,
  ): Promise<DeleteOrganizationResponseDTO> {
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      throw new HttpException(
        {
          success: false,
          error: 'organization not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.organizationModel.deleteOne({
        _id: organizationId,
      });
      return {
        success: true,
        organization,
        message: 'organization deleted',
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

  async addExaminerToOrganization({
    organizationId,
    examinerName,
    examinerEmail,
  }) {
    var user = await this.userModel.findOne({ email: examinerEmail });
    if (!user) {
      const password = Math.random().toString(36).substring(5); //random pw
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await new this.userModel({
        name: examinerName,
        email: examinerEmail,
        password: hashedPassword,
        role: 'examiner',
      }).save();
    }

    var organization = await this.organizationModel.findById(organizationId);
    if (organization.examiners.includes(user._id)) {
      throw new HttpException(
        {
          success: false,
          error: 'user already exists in your examiners list',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      organization.examiners.push(user);
      await organization.save();

      organization = await this.organizationModel
        .findById(organizationId)
        .populate(['examiners']);

      return {
        success: true,
        organization,
      };
    }
  }
}
