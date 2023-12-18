import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber
} from 'class-validator'

/**
 * 업데이트 할 점수 정보를 담고 있는 객체
 */
export class UpdateScoreDTO {
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(8)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  homeTeamQuarterScores: number[]

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(8)
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  awayTeamQuarterScores: number[]

  @IsBoolean()
  @IsNotEmpty()
  overtime: boolean
}
