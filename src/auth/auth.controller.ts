import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitialSuperAdminSetupDTO, LoginDTO, ResetPasswordDTO } from './dto/auth.dto';

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
  resetPassword(@Param('token') token: string, @Body() resetPasswordDTO: ResetPasswordDTO) {
    if (token) {
      return this.authService.resetPassword({...resetPasswordDTO, token});
    } else {
      return this.authService.requestPasswordReset(resetPasswordDTO);
    }
  }
}
