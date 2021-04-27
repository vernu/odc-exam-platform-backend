import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrganizationDTO } from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Post('create')
  createOrganization(@Body() createOrganizationDTO: CreateOrganizationDTO) {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }
}
