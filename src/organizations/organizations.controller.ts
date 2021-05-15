import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AddExaminerToOrganizationDTO,
  CreateOrganizationDTO,
  CreateOrganizationResponseDTO,
  FindAnOrganizationResponseDTO,
  ShowOrganizationsResponseDTO,
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
    const organization = await this.organizationsService.findOrganizationById(
      organizationId,
    );
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

  @Delete(':organizationId')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationsService.deleteOrganization(organizationId);
  }

  @Post(':organizationId/add-examiner')
  @UseGuards(JwtAuthGuard, CanAddExaminerToAnOrganization)
  addExaminerToOrganization(
    @Param('organizationId') organizationId: string,
    @Body() addExaminerToOrganizationDTO: AddExaminerToOrganizationDTO,
  ) {
    return this.organizationsService.addExaminerToOrganization({
      organizationId,
      examinerName: addExaminerToOrganizationDTO.examinerName,
      examinerEmail: addExaminerToOrganizationDTO.examinerEmail,
    });
  }
}
