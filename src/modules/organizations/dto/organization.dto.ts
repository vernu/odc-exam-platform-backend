import { Organization } from '../schemas/organization.schema';

export class CreateOrganizationDTO {
  organizationName: string;
  organizationDescription: string;
  adminName: string;
  adminEmail: string;
}
export class CreateOrganizationResponseDTO {
  success: boolean;
  organization?: Organization;
  error?: string;
  message?: string;
}
export class ShowOrganizationsResponseDTO {
  success: boolean;
  count?: number;
  organizations?: Organization[];
  error?: string;
  message?: string;
}

export class DeleteOrganizationResponseDTO {
  success: boolean;
  organization?: Organization;
  error?: string;
  message?: string;
}

export class AddExaminerToOrganizationDTO {
  examinerName: string;
  examinerEmail: string;
}
