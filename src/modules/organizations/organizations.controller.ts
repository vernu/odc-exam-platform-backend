import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrganizationDTO } from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Get()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  showOrganizations() {
    return this.organizationsService.showOrganizations();
  }
  @Post('create')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  createOrganization(@Body() createOrganizationDTO: CreateOrganizationDTO) {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }
}
