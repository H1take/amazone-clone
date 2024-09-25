import { IsEmail, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at  least 6 charters long!'
	})
	password: string

	// @IsJWT()
	// accessToken: string
}
