import { User } from 'src/modules/users/schemas/user.schema';

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
  accessToken?: string;
  message?: string;
  error?: string;
}
