import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitialSuperAdminSetupDTO, LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initial-super-admin-setup')
  initialSuperAdminSetup(@Body() initialSuperAdminSetupDTO: InitialSuperAdminSetupDTO) {
    return this.authService.initialAdminSetup(initialSuperAdminSetupDTO);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
