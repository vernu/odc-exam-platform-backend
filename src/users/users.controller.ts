import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterExaminerDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
