import { IsNotEmpty, IsUrl } from 'class-validator'

export class BoardImageDTO {
  @IsUrl()
  @IsNotEmpty()
  url: string
}
