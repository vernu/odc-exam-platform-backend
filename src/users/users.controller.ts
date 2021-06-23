import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from './dto/user.dto';
import { CanUpdateUser } from './guards/can-update-user.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, CanUpdateUser)
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    const data = await this.usersService.updateUser(userId, updateUserDTO);
    return { success: true, data };
  }
}
