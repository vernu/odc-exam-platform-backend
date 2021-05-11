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
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async findOrganizationById(id: string) {
    try {
      const organization = await this.organizationModel.findById(id);
      return {
        success: true,
        data: organization,
      };
    } catch (e) {
      throw new HttpException(
        { success: false, error: 'failed to get organization' },
        500,
      );
    }
  }

  async findOrganizationByAdmin(userId: string) {
    return await this.organizationModel
      .find()
      .where({ admin: { _id: userId } });
  }

  async showOrganizations(): Promise<ShowOrganizationsResponseDTO> {
    try {
      const organizations = await this.organizationModel
        .find()
        .populate(['admin', 'examiners']);
      return {
        success: true,
        count: organizations.length,
        data: organizations,
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
      const password = this.usersService.generateRandomPassword();

      try {
        const newUser = await this.usersService.createUser({
          name: organizationInfo.adminName,
          email: organizationInfo.adminEmail,
          password,
          role: 'organization-admin',
        });

        const newOrganization = new this.organizationModel({
          name: organizationInfo.organizationName,
          description: organizationInfo.organizationDescription,
          admin: newUser,
        });
        await newOrganization.save();
        return {
          success: true,
          message: 'Organizer has been added',
          data: newOrganization,
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
        data: organization,
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
      const password = this.usersService.generateRandomPassword();
      user = await this.usersService.createUser({
        name: examinerName,
        email: examinerEmail,
        password,
        role: 'examiner',
      });
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
        message: 'examiner has been added to organization',
        data: organization,
      };
    }
  }
}
