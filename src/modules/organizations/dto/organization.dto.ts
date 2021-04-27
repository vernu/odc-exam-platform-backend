import { Organization } from "../schemas/organization.schema";

export class CreateOrganizationDTO {
  organizationName: string;
  organizationDescription: string;
  adminName: string;
  adminEmail: string;
}
export class CreateOrganizationResponseDTO {
  success: boolean;
  organization?: Organization
  error?: string;
  message?: string;
}
