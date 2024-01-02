export interface Score {
  gameId: number // 경기의 식별자
  homeTeamScore: number // 홈 팀의 총점
  homeTeamQuarterScores: number[] // 홈 팀의 쿼터별 점수
  awayTeamScore: number // 어웨이 팀의 총점
  awayTeamQuarterScores: number[] // 어웨이 팀의 쿼터별 점수
  overtime: boolean // 연장 여부
}
