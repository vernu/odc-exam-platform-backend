import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AddExaminerToOrganizationDTO,
  AddExaminerToOrganizationResponseDTO,
  CreateOrganizationDTO,
  CreateOrganizationResponseDTO,
  DeleteOrganizationResponseDTO,
  FindAnOrganizationResponseDTO,
  ShowOrganizationsResponseDTO,
  UpdateOrganizationDTO,
  UpdateOrganizationResponseDTO,
} from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';
import { CanViewAllOrganizations } from './guards/can-view-all-organizations.guard';
import { CanViewAnOrganization } from './guards/can-view-an-organization.guard';
import { CanAddExaminerToAnOrganization } from './guards/can-add-examiner-to-an-organization.guard';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Get()
  @UseGuards(JwtAuthGuard, CanViewAllOrganizations)
  async getOrganizations(): Promise<ShowOrganizationsResponseDTO> {
    const organizations = await this.organizationsService.getOrganizations();
    return {
      success: true,
      count: organizations.length,
      data: organizations,
    };
  }
  @Get(':organizationId')
  @UseGuards(JwtAuthGuard, CanViewAnOrganization)
  async findOrganizationById(
    @Param('organizationId') organizationId: string,
  ): Promise<FindAnOrganizationResponseDTO> {
    const organization = await this.organizationsService.findAnOrganization({
      _id: organizationId,
    });
    if (organization) {
      return {
        success: true,
        data: organization,
      };
    } else {
      throw new HttpException(
        {
          success: false,
          error: 'Organization not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async createOrganization(
    @Body() createOrganizationDTO: CreateOrganizationDTO,
  ): Promise<CreateOrganizationResponseDTO> {
    const organization = await this.organizationsService.createOrganization(
      createOrganizationDTO,
    );
    return {
      success: true,
      data: organization,
    };
  }
  @Patch(':organizationId')
  @UseGuards(JwtAuthGuard)
  async updateOrganization(
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationDTO: UpdateOrganizationDTO,
  ) {
    const data = await this.organizationsService.updateOrganization(
      organizationId,
      updateOrganizationDTO,
    );
    return {
      success: true,
      message: 'organization updated',
      data,
    };
  }

  @Delete(':organizationId')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async deleteOrganization(
    @Param('organizationId') organizationId: string,
  ): Promise<DeleteOrganizationResponseDTO> {
    return {
      success: true,
      message: 'organization deleted',
      data: await this.organizationsService.deleteOrganization(organizationId),
    };
  }

  @Post(':organizationId/add-examiner')
  @UseGuards(JwtAuthGuard, CanAddExaminerToAnOrganization)
  async addExaminerToOrganization(
    @Param('organizationId') organizationId: string,
    @Body() addExaminerToOrganizationDTO: AddExaminerToOrganizationDTO,
  ): Promise<AddExaminerToOrganizationResponseDTO> {
    const organization = await this.organizationsService.addExaminerToOrganization(
      {
        organizationId,
        examinerName: addExaminerToOrganizationDTO.examinerName,
        examinerEmail: addExaminerToOrganizationDTO.examinerEmail,
      },
    );
    return {
      success: true,
      message: 'examiner has been added to organization',
      data: organization,
    };
  }
}
