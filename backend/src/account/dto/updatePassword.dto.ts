// import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

// export class UpdatePasswordDTO {
//   @IsStrongPassword({
//     minLength: 8,
//     minNumbers: 1,
//     minSymbols: 1
//   })
//   @IsNotEmpty()
//   password: string

//   @IsString()
//   @IsNotEmpty()
//   pin: string
// }

export class UpdatePasswordDTO {
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 0,
    minLowercase: 1
  })
  @IsNotEmpty()
  newPassword: string

  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
