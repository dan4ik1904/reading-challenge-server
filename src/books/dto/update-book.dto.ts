import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateBookDto {
    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    author: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    name: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    pageCount: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    rating: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    review: string
}