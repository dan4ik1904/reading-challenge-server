import { Controller, Get, Headers, Param, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from 'src/guards/auth.guard'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение списка всех пользователей' })
  @ApiOkResponse({ description: 'Успешное получение списка пользователей' })
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка топ пользователей (с пагинацией)' })
  @ApiOkResponse({ description: 'Успешное получение списка топ пользователей' })
  @Get('/top')
  getTop(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.usersService.getTop(page, limit);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка одноклассников' })
  @ApiOkResponse({ description: 'Успешное получение списка одноклассников' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @UseGuards(AuthGuard)
  @Get('/classmates')
  getClassmates(@Headers('Authorization') tgId: string) {
    const tgIdNumber = Number(tgId);
    return this.usersService.getClassmates(tgIdNumber);
  }
  
  @ApiOperation({ summary: 'Получение одного пользователя' })
  @ApiOkResponse({ description: 'Успешное получение одного пользователя' })
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.usersService.getOneUser(Number(id));
  }
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
