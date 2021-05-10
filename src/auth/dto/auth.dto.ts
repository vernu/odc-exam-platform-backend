import { Organization } from 'src/organizations/schemas/organization.schema';
import { User } from '../../users/schemas/user.schema';

export class InitialSuperAdminSetupDTO {
  name: string;
  email: string;
  password: string;
}

export class InitialSuperAdminSetupResponsDTO {
  success: boolean;
  user?: User;
  accessToken?: string;
  error?: string;
}

export class LoginDTO {
  email: string;
  password: string;
}

export class LoginResponseDTO {
  success: boolean;
  user?: User;
  organizations?: [Organization]
  accessToken?: string;
  message?: string;
  error?: string;
}
