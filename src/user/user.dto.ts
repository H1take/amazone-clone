import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@IsString()
	@IsOptional()
	password?: string

	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	avatarPath: string

	@IsString()
	@IsOptional()
	phone?: string
}
