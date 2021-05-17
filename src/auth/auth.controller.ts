import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  InitialSuperAdminSetupDTO,
  InitialSuperAdminSetupResponsDTO,
  LoginDTO,
  LoginResponseDTO,
  RequestPasswordResetDTO,
  RequestPasswordResetResponseDTO,
  ResetPasswordDTO,
  ResetPasswordResponseDTO,
  ValidatePasswordResetSecretCodeDTO,
  ValidatePasswordResetSecretCodeResponseDTO,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initial-super-admin-setup')
  async initialSuperAdminSetup(
    @Body() initialSuperAdminSetupDTO: InitialSuperAdminSetupDTO,
  ): Promise<InitialSuperAdminSetupResponsDTO> {
    return {
      success: true,
      message: 'super-admin account has been created',
      ...(await this.authService.initialSuperAdminSetup(
        initialSuperAdminSetupDTO,
      )),
    };
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDTO> {
    return {
      success: true,
      message: 'logged in successfully',
      ...(await this.authService.login(loginDTO)),
    };
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() requestPasswordResetDTO: RequestPasswordResetDTO,
  ): Promise<RequestPasswordResetResponseDTO> {
    return {
      success: true,
      message: await this.authService.requestPasswordReset(
        requestPasswordResetDTO,
      ),
    };
  }

  @Post('validate-password-reset-secret-code')
  async vaidatePasswordResetSecretCode(
    @Body() validatePasswordResetCodeDTO: ValidatePasswordResetSecretCodeDTO,
  ): Promise<ValidatePasswordResetSecretCodeResponseDTO> {
    return {
      success: true,
      message: await this.authService.validatePasswordResetSecretCode(
        validatePasswordResetCodeDTO,
      ),
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<ResetPasswordResponseDTO> {
    return {
      success: true,
      message: await this.authService.resetPassword(resetPasswordDTO),
    };
  }
}
