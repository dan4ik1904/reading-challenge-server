import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AuthModule, UsersModule, BooksModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ]
})
export class AppModule {}
