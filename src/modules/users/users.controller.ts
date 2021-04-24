import { Body, Controller, Post } from '@nestjs/common';
import { RegisterExaminerDTO } from '../users/dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register-examiner')
  registerExaminer(@Body() registerExaminerDTO: RegisterExaminerDTO) {
    return this.usersService.registerExaminer(registerExaminerDTO);
  }
}
