import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, PrismaService, UsersService],
  exports: [BooksService]
})
export class BooksModule {}
