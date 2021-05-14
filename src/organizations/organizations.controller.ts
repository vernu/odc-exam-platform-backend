import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AddExaminerToOrganizationDTO,
  CreateOrganizationDTO,
} from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';
import * as bcrypt from 'bcrypt';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Get()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  showOrganizations() {
    return this.organizationsService.showOrganizations();
  }
  @Get(':organizationId')
  @UseGuards()
  getOrganizationById(@Param('organizationId') organizationId: string) {
    return this.organizationsService.findOrganizationById(organizationId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  createOrganization(@Body() createOrganizationDTO: CreateOrganizationDTO) {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }

  @Delete(':organizationId')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationsService.deleteOrganization(organizationId);
  }

  @Post(':organizationId/add-examiner')
  @UseGuards(JwtAuthGuard)
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
