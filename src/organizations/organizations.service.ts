import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  CreateOrganizationDTO,
  CreateOrganizationResponseDTO,
  DeleteOrganizationResponseDTO,
  ShowOrganizationsResponseDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async findAnOrganization(org) {
    return await this.organizationModel
      .findOne(org)
      .populate(['admin', 'examiners']);
  }

  async findOrganizations(org) {
    return await this.organizationModel
      .find(org)
      .populate(['admin', 'examiners']);
  }

  // async findOrganizationById(id: string) {
  //   try {
  //     const organization = await this.organizationModel
  //       .findById(id)
  //       .populate(['admin', 'examiners']);
  //     return organization;
  //   } catch (e) {
  //     throw new HttpException(
  //       { success: false, error: 'failed to get organization' },
  //       500,
  //     );
  //   }
  // }

  // async findOrganizationByAdmin(userId: string) {
  //   return await this.organizationModel.find().where({ admin: userId });
  // }

  async getOrganizations(): Promise<any> {
    try {
      const organizations = await this.organizationModel
        .find()
        .populate(['admin', 'examiners']);
      return organizations;
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

  async createOrganization(organizationInfo: CreateOrganizationDTO) {
    var user = await this.userModel.findOne({
      email: organizationInfo.adminEmail,
    });

    if (!user) {
      if (organizationInfo.adminName == null) {
        throw new HttpException(
          {
            success: false,
            error: 'Admin name cannot be empty',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const password = this.usersService.generateRandomPassword();

      const newUser = await this.usersService.createUser({
        name: organizationInfo.adminName,
        email: organizationInfo.adminEmail,
        password,
        role: 'organization-admin',
      });
      user = newUser;
    }

    const newOrganization = new this.organizationModel({
      name: organizationInfo.organizationName,
      description: organizationInfo.organizationDescription,
      admin: user,
    });

    try {
      await newOrganization.save();
      return newOrganization;
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `failed to create organization: ${e.toString()}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOrganization(
    organizationId: string,
    updateOrganizationDTO: UpdateOrganizationDTO,
  ) {
    const { organizationName, organizationDescription } = updateOrganizationDTO;

    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });

    if (!organization) {
      throw new HttpException(
        {
          success: false,
          error: 'Organization not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await organization.updateOne({
      name: organizationName || organization.name,
    });
    await organization.updateOne({
      description: organizationDescription || organization.description,
    });

    return await this.organizationModel.findOne({
      _id: organizationId,
    });
  }

  async deleteOrganization(organizationId: string): Promise<any> {
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
      return organization;
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `failed to delete organization: ${e.toString()}`,
        },
        HttpStatus.BAD_REQUEST,
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
      if (examinerName == null) {
        throw new HttpException(
          {
            success: false,
            error: 'Examiner name cannot be empty',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

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

      return organization;
    }
  }
}
