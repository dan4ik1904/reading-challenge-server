import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthorBookGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const tgId = req.headers.authorization;

        if (!tgId) throw new HttpException({ message: 'No authorized' }, 401);

        const session = await this.prisma.users_sessions.findFirst({
            where: {
                tgId: Number(tgId)
            }
        });

        if (!session) {
            throw new HttpException({ message: 'Session not found' }, 401);
        }

        const user = await this.prisma.users.findFirst({
            where: { id: session.userId }
        });

        if (!user) {
            throw new HttpException({ message: 'User not found' }, 404);
        }

        const book = await this.prisma.books.findFirst({
            where: {
                id: req.params.id
            }
        });

        if (!book) {
            throw new HttpException({ message: 'Book not found' }, 404);
        }

        if (user.id != book.userId && user.role !== 'admin') throw new HttpException({ message: 'No authorized' }, 403);
        
        return true;
    }
}