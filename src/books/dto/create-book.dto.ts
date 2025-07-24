import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateBookDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    author: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    pageCount: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    rating: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    review: string

}