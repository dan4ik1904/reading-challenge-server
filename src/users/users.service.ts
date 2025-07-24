import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UsersService {

    constructor(private readonly prisma:PrismaService){}


    async getUserByTgId(tgId: number) {
        try {
            const session = await this.prisma.userSession.findFirst({
                where: {
                    tgId
                }
            })
            const user = await this.prisma.user.findFirst({
                where: {
                    id: session.userId
                }
            })
            return user
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async findAll() {
        try {
            const users = await this.prisma.user.findMany()
            console.log(users)
            return users
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getTop(page: number, limit: number) {
        // Проверяем, что page и limit положительные числа
        if (page < 1 || limit < 1) {
            throw new HttpException('Page and limit must be greater than 0', 400);
        }
    
        try {
            const users = await this.prisma.user.findMany({
                orderBy: [
                    { pagesCount: 'desc' },
                    { id: 'asc' } // Сортировка по id для предотвращения повторений
                ],
                skip: (page - 1) * limit,
                take: Number(limit)
            });
    
            return users.length > 0 ? users : []; // Возвращаем пустой массив, если пользователей нет
        } catch (error) {
            console.error('Error fetching top users:', error);
            throw new HttpException({ error: error.message || 'Internal Server Error' }, 500);
        }
    }
    

    async getClassmates(tgId: number) {
        try {
            const user = await this.getUserByTgId(tgId)
            const users = this.prisma.user.findMany({
                where: {
                    className: user.className
                },
                orderBy: {
                    pagesCount: 'desc'
                }
            })
            return users
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getOneUser(id: number) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: id
                }
            })
            return user
        } catch (e) {
            throw new HttpException({e}, 500)
        }
    }

}
