import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class authMe {
    @ApiProperty()
    @IsNumber()
    tgId: number
}