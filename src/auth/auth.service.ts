import { HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';


@Injectable()
export class AuthService {

    constructor(private readonly prisma:PrismaService){}

    async auth(authDto: AuthDto) {
        try {
            // Найти пользователя по полям fullName и className
            const user = await this.prisma.users.findFirst({
                where: {
                    fullName: authDto.fullName,
                    className: authDto.className,
                },
            });
    
            // Если пользователь не найден, создаем нового
            const createdUser = user || await this.prisma.users.create({
                data: {
                    className: authDto.className,
                    fullName: authDto.fullName,
                },
            });
    
            // Проверяем наличие существующих сессий
            const existingSession = await this.prisma.users_sessions.findFirst({
                where: { userId: createdUser.id },
            });
    
            if (existingSession) {
                throw new HttpException({ message: 'У пользователя уже есть активная сессия.' }, 409); // 409 Конфликт
            }
    
            await this.prisma.users_sessions.create({
                data: {
                    tgId: authDto.tgId,
                    userId: createdUser.id,
                },
            });
    
            return { message: 'success' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Повторно вызываем существующее исключение HttpException
            }
            console.error("Непредвиденная ошибка во время аутентификации:", error); // Логируем непредвиденные ошибки
            throw new HttpException({ message: 'Произошла непредвиденная ошибка.' }, 500); // Общая ошибка сервера
        }
    }

    async getMe(tgId: number) {
        const session = await this.prisma.users_sessions.findFirst({
            where: {
                tgId: Number(tgId)
            }
        })
        if(!session) return {auth: false}

        const user = await this.prisma.users.findFirst({
            where: {
                id: session.userId
            }
        })
        return user
    }

    async getMySessions(tgId: number) {
        try {
            const session = await this.prisma.users_sessions.findFirst({
                where: {
                    tgId: Number(tgId)
                }
            })
            const user = await this.prisma.users.findFirst({
                where: {
                    id: session.userId
                }
            })
            const sessions = await this.prisma.users_sessions.findMany({
                where: {
                    userId: user.id
                }
            })
            return sessions
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async updateMe(tgId: number, updateMeDto: UpdateMeDto) {
        await this.prisma.users_sessions.findFirst({
            where: {tgId}
        })
    }

    async authLogout(tgId: number) {
        try {
            const session = await this.prisma.users_sessions.findFirst({
                where: {
                    tgId
                }
            })
            const sessionDelete = await this.prisma.users_sessions.delete({
                where: {
                    id: session.id
                }
            })
            return sessionDelete
        } catch (error) {
            
        }
    }

}
