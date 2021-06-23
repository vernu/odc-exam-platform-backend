import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    const data = await this.usersService.updateUser(userId, updateUserDTO);
    return { success: true, data };
  }
}
