import { User } from '../schemas/user.schema';

export class RegisterExaminerDTO {
  name: string;
  email: string;
}

export class RegisterExaminerResponseDTO {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

export class UpdateUserDTO {
  name: string;
  email: string;
}
