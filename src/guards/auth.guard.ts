import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const tgId = req.headers.authorization;

    if (!tgId) throw new HttpException({message: 'No authorizade'}, 401);

    // Проверяем наличие сессии пользователя и сразу возвращаем результат
    return !!(await this.prisma.userSession.findFirst({
      where: { tgId: Number(tgId) },
    }));
  }
}