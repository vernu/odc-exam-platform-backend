import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrganizationDTO } from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Post('create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createOrganization(@Body() createOrganizationDTO: CreateOrganizationDTO) {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }
}
