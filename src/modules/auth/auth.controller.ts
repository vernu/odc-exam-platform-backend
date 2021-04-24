import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitialAdminSetupDTO, LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initial-admin-setup')
  initialAdminSetup(@Body() initialAdminSetupDTO: InitialAdminSetupDTO) {
    return this.authService.initialAdminSetup(initialAdminSetupDTO);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO): any {
    return this.authService.login(loginDTO);
  }
}
