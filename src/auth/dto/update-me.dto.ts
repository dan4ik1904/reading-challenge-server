import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsNotEmpty, IsOptional } from "class-validator"

export class UpdateMeDto {
    @ApiProperty({
        required: false,
        type: String
    })
    @IsOptional()
    @IsString()
    fullName: string

    @ApiProperty({
        required: false,
        type: String
    })
    @IsOptional()
    @IsString()
    className: string
}