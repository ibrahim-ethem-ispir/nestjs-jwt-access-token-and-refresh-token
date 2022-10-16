import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    name: string;
}