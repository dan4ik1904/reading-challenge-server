import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService){}

    async getAll() {
        try {
            const books = await this.prisma.book.findMany()
            return books
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getOne(id: number) {
        try {
            const book = await this.prisma.book.findUnique({
                where: {id}
            })
            return book
        } catch (error) {
            throw new HttpException({message: 'No book'}, 400)
        }
        
    }

    async getMyBooks(tgId: number) {
        try {
            const session = await this.prisma.userSession.findFirst({
                where: {
                    tgId
                }
            })
            const books = await this.prisma.book.findMany({
                where: {userId: session.userId}
            })
            return books
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }

    async getMyTopBooks(userId: number) {
        try {

            const books = await this.prisma.book.findMany({
                where: {userId},
                orderBy: {
                    pageCount: 'desc'
                }
            })
            return books
        } catch (error) {
            throw new HttpException({error}, 500)
        }

    }

    async updateOne(id: number, updateBookDto: UpdateBookDto, tgId: number) {
        try {
            const book = await this.prisma.book.findFirst({ where: { id } });
            if (!book) {
            // Обработка случая, если книга не найдена (например, вернуть ошибку)
            return null; // Или вернуть какое-то значение, обозначающее неудачу
            }
        
            const updatedBook = await this.prisma.book.update({
            where: { id },
            data: updateBookDto, // Обновляем книгу с данными из updateBookDto
            });
        
            // Получаем информацию о пользователе, связанном с сессией
            const session = await this.prisma.userSession.findFirst({
            where: { tgId },
            });
        
            if (!session) {
            // Обработка случая, если сессия не найдена (например, вернуть ошибку)
            return null; // Или вернуть какое-то значение, обозначающее неудачу
            }
        
            // Получаем информацию о пользователе, связанном с сессией
            const user = await this.prisma.user.findFirst({
            where: { id: session.userId },
            });
        
            if (!user) {
            // Обработка случая, если пользователь не найден (например, вернуть ошибку)
            return null; // Или вернуть какое-то значение, обозначающее неудачу
            }
        
            // Обновляем количество страниц, прочитанных пользователем
            await this.prisma.user.update({
            where: { id: user.id },
            data: {
                pagesCount:
                user.pagesCount -
                (book.pageCount || 0) +
                (updateBookDto?.pageCount || 0), // Обновление количества страниц
            },
            });
            return updatedBook; // Возвращаем обновленную книгу
        } catch (error) {
            throw new HttpException({error}, 500)

        }
      
      }

    async createBook(createBookDto: CreateBookDto, tgId: number) {
        try {
            const user_session = await this.prisma.userSession.findFirst({
                where: {
                    tgId
                }
            })
            const updBook = await this.prisma.book.create({
                data: {
                    ...createBookDto,
                    userId: user_session.userId
                }
            })
            const user = await this.prisma.user.findFirst({
                where: {
                    id: user_session.userId
                }
            })
            const updUser = await this.prisma.user.update({
                where: {
                    id: user_session.userId
                },
                data: {
                    pagesCount: user.pagesCount + createBookDto.pageCount,
                    booksCount: user.booksCount + 1
                }
            })
            return updBook
        } catch (error) {
            throw new HttpException({message: error}, 500)
        }
        
    }

    async deleteBook(id: number, tgId: number) {
        try {
            const thisBook = await this.prisma.book.findFirst({
                where: {
                    id
                }
            })
            const user = await this.prisma.user.findFirst({
                where: {
                    id: thisBook.userId
                }
            })
            
            const updUser = await this.prisma.user.update({
                where: {
                    id: thisBook.userId
                },
                data: {
                    pagesCount: user.pagesCount -thisBook.pageCount,
                    booksCount: user.booksCount - 1
                }
            })
            const book = await this.prisma.book.delete({
                where: { id }
            })
            return book
        } catch (error) {
            throw new HttpException({error}, 500)
        }
        
    }


}
