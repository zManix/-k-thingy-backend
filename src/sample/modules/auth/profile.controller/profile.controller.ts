import { Controller, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BaseController } from '../../../base/base.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserInfoDto, UserReturnDto } from '../../../generic.dtos/userDtoAndEntity';
import { ErrorUnauthorizedDto } from '../../../generic.dtos/error.unauthorized.dto';
import { CurrentUser } from '../../../decorators/current-user/current-user.decorator';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { UserService } from '../user.service/user.service';

@Controller('auth')
@ApiTags('Auth Methods')
@ApiBearerAuth()
export class ProfileController extends BaseController {
  constructor(private readonly userService: UserService) {
    super('ProfileController');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({
    description: 'Get the current user profile',
    type: UserReturnDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async getProfile(
    @CorrId() corrId: number,
    @CurrentUser() userInfoDto: UserInfoDto,
  ): Promise<UserReturnDto> {
    const method = 'getProfile';
    this.wl(corrId, method, `userInfoDto: ${JSON.stringify(userInfoDto, null, 2)}`);

    const userEntity = await this.userService.findOne(userInfoDto.username);
    if (!userEntity) {
      throw new UnauthorizedException('User not found');
    }

    const userReturn: UserReturnDto = {
      userId: userEntity.id,
      username: userEntity.username,
      roles: userEntity.role ? [userEntity.role] : [],
    };

    this.wl(corrId, method, `userReturn: ${JSON.stringify(userReturn, null, 2)}`);
    return userReturn;
  }
}
