import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  InitialSuperAdminSetupDTO,
  LoginDTO,
  ResetPasswordDTO,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initial-super-admin-setup')
  initialSuperAdminSetup(
    @Body() initialSuperAdminSetupDTO: InitialSuperAdminSetupDTO,
  ) {
    return this.authService.initialSuperAdminSetup(initialSuperAdminSetupDTO);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    if (resetPasswordDTO.secretCode) {
      return this.authService.resetPassword(resetPasswordDTO);
    } else {
      return this.authService.requestPasswordReset(resetPasswordDTO);
    }
  }
}
