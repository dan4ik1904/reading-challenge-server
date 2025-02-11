import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsNotEmpty } from "class-validator"

export class AuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fullName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    className: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    tgId: number
}