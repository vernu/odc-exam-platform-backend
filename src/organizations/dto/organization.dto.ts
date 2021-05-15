import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';

export class CreateOrganizationDTO {
  organizationName: string;
  organizationDescription: string;
  adminName: string;
  adminEmail: string;
}
export class CreateOrganizationResponseDTO {
  success: boolean;
  data?: Organization;
  error?: string;
  message?: string;
}
export class ShowOrganizationsResponseDTO {
  success: boolean;
  count?: number;
  data?: Organization[];
  error?: string;
  message?: string;
}

export class DeleteOrganizationResponseDTO {
  success: boolean;
  data?: Organization;
  error?: string;
  message?: string;
}

export class AddExaminerToOrganizationDTO {
  examinerName: string;
  examinerEmail: string;
}
export class AddExaminerToOrganizationResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  data: Organization;
}
export class FindAnOrganizationResponseDTO {
  success: true;
  data?: OrganizationDocument;
  message?: string;
  error?: string;
}
