import { User } from 'src/schemas/user.schema';

export class InitialAdminSetupDTO {
  name: string;
  email: string;
  password: string;
}

export class InitialAdminSetupResponsDTO {
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
  error?: string;
}
