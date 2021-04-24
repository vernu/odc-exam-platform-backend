import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterExaminerDTO } from '../users/dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register-examiner')
  @UseGuards(JwtAuthGuard, AdminGuard)
  registerExaminer(@Body() registerExaminerDTO: RegisterExaminerDTO) {
    return this.usersService.registerExaminer(registerExaminerDTO);
  }
}
