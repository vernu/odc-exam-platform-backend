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
import { CanViewAllOrganizations } from './guards/can-view-all-organizations.guard';
import { CanViewAnOrganization } from './guards/can-view-an-organization.guard';
import { CanAddExaminerToAnOrganization } from './guards/can-add-examiner-to-an-organization.guard';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Get()
  @UseGuards(JwtAuthGuard, CanViewAllOrganizations)
  showOrganizations() {
    return this.organizationsService.showOrganizations();
  }
  @Get(':organizationId')
  @UseGuards(JwtAuthGuard, CanViewAnOrganization)
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
