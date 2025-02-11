import { Body, Controller, Get, Headers, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { BooksService } from 'src/books/books.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthorBookGuard } from 'src/guards/author-book.guard';


@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly booksService: BooksService    
                ) {}


    @ApiOperation({ summary: 'Авторизация' })
    @ApiBody({ type: AuthDto })
    @ApiCreatedResponse({ description: 'Успешная авторизация' })
    @Post()
    auth(@Body() authDto: AuthDto) {
        return this.authService.auth(authDto)
    }


    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение информации о пользователе' })
    @ApiOkResponse({ description: 'Успешное получение информации о пользователе' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @UseGuards(AuthGuard)
    @Get('/me')
    authMe(@Headers('Authorization') tgId: string) {
        const tgIdNumber = Number(tgId)
        return this.authService.getMe(tgIdNumber)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение списка книг пользователя' })
    @ApiOkResponse({ description: 'Успешное получение списка книг пользователя' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @UseGuards(AuthGuard)
    @Get('/mybooks')
    getMy(@Headers('Authorization') tgId: string) {
      const tgIdNumber = Number(tgId)
      return this.booksService.getMyBooks(tgIdNumber)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Обновление информации о пользователе' })
    @ApiBody({ type: UpdateMeDto })
    @ApiOkResponse({ description: 'Успешное обновление информации о пользователе' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @UseGuards(AuthGuard)
    @Patch('/me')
    updateMe(@Headers('Authorization') tgId: string, @Body() updateMeDto: UpdateMeDto) {
        const tgIdNumber = Number(tgId)
        return this.authService.updateMe(tgIdNumber, updateMeDto)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение списка сессий пользователя' })
    @ApiOkResponse({ description: 'Успешное получение списка сессий пользователя' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @UseGuards(AuthGuard)
    @Get('/sessions')
    authMysessions(@Headers('Authorization') tgId: string) {
        const tgIdNumber = Number(tgId)
        return this.authService.getMySessions(tgIdNumber)
    }
    
    @Post('/logout')
    authLogout(@Headers('Authorization') tgId: string) {
        const tgIdNumber = Number(tgId)
        return this.authService.authLogout(tgIdNumber)
    }

}
