import {
  type Prisma,
  PrismaClient,
  Role,
  AccountStatus,
  TeamEnrollStatus,
  TeamStatus,
  LeagueApplyStatus,
  GameResult,
  RosterType,
  RosterStatus,
  GenderType,
  RecordType,
  PostType
} from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const main = async function () {
  /**
   * 계정 생성
   */

  const accounts: Prisma.AccountCreateManyInput[] = [
    /**
     * 이메일 인증, 본인 인증, 증명서 업로드가 완료된 유저 (user01 ~ user05)
     */
    {
      username: 'user01',
      email: 'user01@example.com',
      role: Role.User,
      name: 'user01',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user02',
      email: 'user02@example.com',
      role: Role.User,
      name: 'user02',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user03',
      email: 'user03@example.com',
      role: Role.User,
      name: 'user03',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user04',
      email: 'user04@example.com',
      role: Role.User,
      name: 'user04',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user05',
      email: 'user05@example.com',
      role: Role.User,
      name: 'user05',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    /**
     * 이메일 인증, 본인 인증이 완료된 유저 (user06 ~ user07)
     */
    {
      username: 'user06',
      email: 'user06@example.com',
      role: Role.User,
      name: 'user06',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user07',
      email: 'user07@example.com',
      role: Role.User,
      name: 'user07',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    /**
     * 이메일 인증만 완료된 유저 (user08 ~ user09)
     */
    {
      username: 'user08',
      email: 'user08@example.com',
      role: Role.User,
      name: 'user08',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'user09',
      email: 'user09@example.com',
      role: Role.User,
      name: 'user09',
      password: await hash('trust@1234'),
      status: AccountStatus.Verifying
    },
    /**
     * 아무런 인증도 하지 않은 유저 (user10)
     */
    {
      username: 'user10',
      email: 'user10@example.com',
      role: Role.User,
      name: 'user10',
      password: await hash('trust@1234'),
      status: AccountStatus.Verifying
    },
    /**
     * 매니저 계정 (manager01 ~ manager03)
     */
    {
      username: 'manager01',
      email: 'manager01@example.com',
      role: Role.Manager,
      name: 'manager01',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'manager02',
      email: 'manager02@example.com',
      role: Role.Manager,
      name: 'manager02',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'manager03',
      email: 'manager03@example.com',
      role: Role.Manager,
      name: 'manager03',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    },
    /**
     * 관리자 계정 (admin01)
     */
    {
      username: 'admin01',
      email: 'admin01@example.com',
      role: Role.Admin,
      name: 'admin01',
      password: await hash('trust@1234'),
      status: AccountStatus.Enable
    }
  ]

  await prisma.account.createMany({
    data: accounts
  })

  /**
   * 유저 계정 개인 인증 정보 생성
   */
  const accountCredentials: Prisma.AccountCredentialCreateManyInput[] = [
    {
      name: 'USER_ONE',
      accountId: 1,
      birthday: new Date('2000-01-01'),
      gender: GenderType.Male
    },
    {
      name: 'USER_TWO',
      accountId: 2,
      birthday: new Date('2000-01-02'),
      gender: GenderType.Female
    },
    {
      name: 'USER_THREE',
      accountId: 3,
      birthday: new Date('2000-01-03'),
      gender: GenderType.Male
    },
    {
      name: 'USER_FOUR',
      accountId: 4,
      birthday: new Date('2000-01-04'),
      gender: GenderType.Male
    },
    {
      name: 'USER_FIVE',
      accountId: 5,
      birthday: new Date('2000-01-05'),
      gender: GenderType.Male
    },
    {
      name: 'USER_SIX',
      accountId: 6,
      birthday: new Date('2000-01-06'),
      gender: GenderType.Male
    },
    {
      name: 'USER_SEVEN',
      accountId: 7,
      birthday: new Date('2000-01-07'),
      gender: GenderType.Male
    }
  ]

  await prisma.accountCredential.createMany({
    data: accountCredentials
  })

  /**
   * 유저 계정 증명서 정보 생성
   */
  const accountCertificaions: Prisma.AccountCertificationCreateManyInput[] = [
    {
      accountId: 1,
      fileUrl: 'https://dev.kafa.one/test'
    },
    {
      accountId: 2,
      fileUrl: 'https://dev.kafa.one/test'
    },
    {
      accountId: 3,
      fileUrl: 'https://dev.kafa.one/test'
    },
    {
      accountId: 4,
      fileUrl: 'https://dev.kafa.one/test'
    },
    {
      accountId: 5,
      fileUrl: 'https://dev.kafa.one/test'
    }
  ]

  await prisma.accountCertification.createMany({
    data: accountCertificaions
  })

  /**
   * 협회 생성
   */

  const associations: Prisma.AssociationCreateManyInput[] = [
    /**
     * 상위 협회 (association01)
     * 리그와 팀 정보를 가지고 있음
     */
    {
      name: 'association01',
      globalName: 'association01',
      initial: 'AONE'
    },
    /**
     * 하위 협회 (association02 ~ association05)
     * 리그와 팀 정보를 가지고 있지 않음
     */
    {
      name: 'association02',
      globalName: 'association02',
      initial: 'ATWO',
      parentId: 1
    },
    {
      name: 'association03',
      globalName: 'association03',
      initial: 'ATHREE',
      parentId: 1
    },
    {
      name: 'association04',
      globalName: 'association04',
      initial: 'ATHREE',
      parentId: 1
    },
    {
      name: 'association05',
      globalName: 'association05',
      initial: 'AFOUR',
      parentId: 1
    },
    {
      name: 'association06',
      globalName: 'association06',
      initial: 'AFIVE',
      parentId: 1
    }
  ]

  await prisma.association.createMany({
    data: associations
  })

  /**
   * 팀 생성
   */

  const teams: Prisma.TeamCreateManyInput[] = [
    /**
     * 활성화된 팀 (team01 ~ team06)
     */
    {
      name: 'team01',
      globalName: 'team01',
      color: '#ffffff',
      establishedAt: new Date('1995-01-01'),
      hometown: 'seoul',
      initial: 'ONE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team02',
      globalName: 'team02',
      color: '#ffffff',
      establishedAt: new Date('1998-01-01'),
      hometown: 'seoul',
      initial: 'TWO',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team03',
      globalName: 'team03',
      color: '#ffffff',
      establishedAt: new Date('2004-01-01'),
      hometown: 'seoul',
      initial: 'THREE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team04',
      globalName: 'team04',
      color: '#ffffff',
      establishedAt: new Date('2005-01-01'),
      hometown: 'seoul',
      initial: 'FOUR',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team05',
      globalName: 'team05',
      color: '#ffffff',
      establishedAt: new Date('2008-01-01'),
      hometown: 'busan',
      initial: 'FIVE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team06',
      globalName: 'team06',
      color: '#ffffff',
      establishedAt: new Date('2013-01-01'),
      hometown: 'busan',
      initial: 'SIX',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    /**
     * 비활성화 된 팀 (team07 ~ team08)
     */
    {
      name: 'team07',
      globalName: 'team07',
      color: '#ffffff',
      establishedAt: new Date('2017-01-01'),
      hometown: 'busan',
      initial: 'SEVEN',
      status: TeamStatus.Disabled,
      associationId: 1
    },
    {
      name: 'team08',
      globalName: 'team08',
      color: '#ffffff',
      establishedAt: new Date('2022-01-01'),
      hometown: 'busan',
      initial: 'EIGHT',
      status: TeamStatus.Disabled,
      associationId: 1
    }
  ]

  await prisma.team.createMany({
    data: teams
  })

  /**
   * 매니저 계정과 팀 계정 연결
   */

  await prisma.account.update({
    where: {
      id: 11
    },
    data: {
      teamId: 1
    }
  })

  await prisma.account.update({
    where: {
      id: 12
    },
    data: {
      teamId: 2
    }
  })

  await prisma.account.update({
    where: {
      id: 13
    },
    data: {
      teamId: 3
    }
  })

  /**
   * 팀 생성 요청 정보 생성
   */

  const registerTeamRequests: Prisma.RegisterTeamRequestCreateManyInput[] = [
    /**
     * 승인된 팀 생성 요청
     */
    {
      accountId: 1,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team03',
        globalName: 'team03',
        color: '#ffffff',
        establishedAt: new Date('2004-01-01'),
        hometown: 'seoul',
        initial: 'THREE',
        associationId: 1
      },
      rejectReason: '',
      status: TeamEnrollStatus.Approved,
      username: 'manager01'
    },
    /**
     * 반려된 팀 생성 요청
     */
    {
      accountId: 4,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team request two',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team request two',
        hometown: 'abc',
        initial: 'Two',
        subColor: undefined
      },
      rejectReason: 'hello world',
      status: TeamEnrollStatus.Rejected,
      username: 'manager04'
    },
    /**
     * 심사중인 팀 생성 요청
     */
    {
      accountId: 4,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team request three',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team request three',
        hometown: 'abc',
        initial: 'Three',
        subColor: undefined
      },
      rejectReason: '',
      status: TeamEnrollStatus.Received,
      username: 'manager05'
    },
    {
      accountId: 5,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team request four',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team request four',
        hometown: 'abc',
        initial: 'Four',
        subColor: undefined
      },
      rejectReason: '',
      status: TeamEnrollStatus.Received,
      username: 'manager06'
    }
  ]

  await prisma.registerTeamRequest.createMany({
    data: registerTeamRequests
  })

  /**
   * 리그 생성
   */

  const now = new Date()

  const threeMonthAgo = new Date(now)
  threeMonthAgo.setMonth(now.getMonth() - 3)

  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)

  const oneMonthLater = new Date(now)
  oneMonthLater.setMonth(now.getMonth() + 1)

  const threeMonthLater = new Date(now)
  threeMonthLater.setMonth(now.getMonth() + 3)

  const leagues: Prisma.LeagueCreateManyInput[] = [
    /**
     * 현재 이전에 끝난 리그 (league01 ~ league03)
     */
    {
      name: 'league01',
      startedAt: threeMonthAgo,
      startedYear: threeMonthAgo.getFullYear(),
      endedAt: oneMonthAgo,
      associationId: 1
    },
    {
      name: 'league02',
      startedAt: threeMonthAgo,
      startedYear: threeMonthAgo.getFullYear(),
      endedAt: oneMonthAgo,
      associationId: 1
    },
    {
      name: 'league03',
      startedAt: threeMonthAgo,
      startedYear: threeMonthAgo.getFullYear(),
      endedAt: oneMonthAgo,
      associationId: 1
    },
    /**
     * 현재 진행중인 리그 (league04 ~ league06)
     */
    {
      name: 'league04',
      startedAt: oneMonthAgo,
      startedYear: oneMonthAgo.getFullYear(),
      endedAt: oneMonthLater,
      associationId: 1
    },
    {
      name: 'league05',
      startedAt: oneMonthAgo,
      startedYear: oneMonthAgo.getFullYear(),
      endedAt: oneMonthLater,
      associationId: 1
    },
    {
      name: 'league06',
      startedAt: oneMonthAgo,
      startedYear: oneMonthAgo.getFullYear(),
      endedAt: oneMonthLater,
      associationId: 1
    },
    /**
     * 앞으로 진행 예정인 리그 (league07 ~ league09)
     */
    {
      name: 'league07',
      startedAt: oneMonthLater,
      startedYear: oneMonthLater.getFullYear(),
      endedAt: threeMonthLater,
      associationId: 1
    },
    {
      name: 'league08',
      startedAt: oneMonthLater,
      startedYear: oneMonthLater.getFullYear(),
      endedAt: threeMonthLater,
      associationId: 1
    },
    {
      name: 'league09',
      startedAt: oneMonthLater,
      startedYear: oneMonthLater.getFullYear(),
      endedAt: threeMonthLater,
      associationId: 1
    }
  ]

  await prisma.league.createMany({
    data: leagues
  })

  /**
   * 팀의 리그 참여 정보 생성
   */
  const teamLeagues: Prisma.TeamLeagueCreateManyInput[] = [
    /**
     * 참여한 팀
     */
    {
      leagueId: 1,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 1
    },
    {
      leagueId: 1,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 3
    },
    {
      leagueId: 1,
      teamId: 3,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 2
    },
    {
      leagueId: 1,
      teamId: 4,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 6
    },
    {
      leagueId: 1,
      teamId: 5,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 5
    },
    {
      leagueId: 1,
      teamId: 6,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 4
    },
    {
      leagueId: 4,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 1
    },
    {
      leagueId: 4,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 3
    },
    {
      leagueId: 4,
      teamId: 3,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 2
    },
    {
      leagueId: 4,
      teamId: 4,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 6
    },
    {
      leagueId: 4,
      teamId: 5,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 5
    },
    {
      leagueId: 4,
      teamId: 6,
      applyStatus: LeagueApplyStatus.Approved,
      rank: 4
    },
    /**
     * 신청 후 보류 된 팀
     */
    {
      leagueId: 7,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Hold,
      rejectReason: 'holded request'
    },
    {
      leagueId: 7,
      teamId: 3,
      applyStatus: LeagueApplyStatus.Hold
    },
    /**
     * 신청 후 반려된 팀
     */
    {
      leagueId: 7,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Rejected,
      rejectReason: 'rejected request'
    },
    /**
     * 신청 중인 팀
     */
    {
      leagueId: 7,
      teamId: 4,
      applyStatus: LeagueApplyStatus.Received
    },
    { leagueId: 8, teamId: 1, applyStatus: LeagueApplyStatus.Received },
    { leagueId: 8, teamId: 2, applyStatus: LeagueApplyStatus.Received },
    { leagueId: 8, teamId: 3, applyStatus: LeagueApplyStatus.Received },
    { leagueId: 8, teamId: 4, applyStatus: LeagueApplyStatus.Received }
  ]

  await prisma.teamLeague.createMany({
    data: teamLeagues
  })

  /**
   * 스폰서 생성
   */

  const sponsers: Prisma.SponserCreateManyInput[] = [
    {
      name: 'sponser01',
      websiteUrl: 'example'
    },
    {
      name: 'sponser02',
      websiteUrl: 'example'
    },
    {
      name: 'sponser03',
      websiteUrl: 'example'
    },
    {
      name: 'sponser04',
      websiteUrl: 'example'
    }
  ]

  await prisma.sponser.createMany({
    data: sponsers
  })

  /**
   * 리그와 스폰서 연결 생성
   */

  const leagueSponsers: Prisma.LeagueSponserCreateManyInput[] = [
    {
      leagueId: 1,
      sponserId: 1
    },
    {
      leagueId: 1,
      sponserId: 2
    },
    {
      leagueId: 1,
      sponserId: 3
    },
    {
      leagueId: 4,
      sponserId: 1
    },
    {
      leagueId: 4,
      sponserId: 4
    }
  ]

  await prisma.leagueSponser.createMany({
    data: leagueSponsers
  })

  /**
   * 경기 생성
   */
  const games: Prisma.GameCreateManyInput[] = [
    /**
     * 종료된 리그의 게임들
     */
    {
      homeTeamId: 1,
      awayTeamId: 2,
      leagueId: 1,
      result: GameResult.HomeWin,
      name: '리그1 1경기',
      stadium: 'seoul',
      startedAt: new Date('2022-01-01')
    },
    {
      homeTeamId: 1,
      awayTeamId: 3,
      leagueId: 1,
      result: GameResult.AwayWin,
      name: '리그1 2경기',
      stadium: 'seoul',
      startedAt: new Date('2022-01-02')
    },
    {
      homeTeamId: 2,
      awayTeamId: 3,
      leagueId: 1,
      result: GameResult.Draw,
      name: '리그1 3경기',
      stadium: 'seoul',
      startedAt: new Date('2022-01-03')
    },
    /**
     * 진행중인 리그의 게임들
     */
    {
      homeTeamId: 1,
      awayTeamId: 2,
      leagueId: 4,
      result: GameResult.HomeWin,
      name: '리그4 1경기',
      stadium: 'seoul',
      startedAt: now
    },
    {
      homeTeamId: 1,
      awayTeamId: 3,
      leagueId: 4,
      result: GameResult.AwayWin,
      name: '리그4 2경기',
      stadium: 'seoul',
      startedAt: now
    },
    {
      homeTeamId: 2,
      awayTeamId: 3,
      leagueId: 4,
      result: GameResult.NotFinished,
      name: '리그4 3경기',
      stadium: 'seoul',
      startedAt: now
    }
  ]

  await prisma.game.createMany({
    data: games
  })

  /**
   * 경기 점수 생성
   */

  const scores: Prisma.ScoreCreateManyInput[] = [
    {
      gameId: 1,
      homeTeamScore: 14,
      homeTeamQuarterScores: [7, 0, 7, 0],
      awayTeamScore: 0,
      awayTeamQuarterScores: [0, 0, 0, 0],
      overtime: false
    },
    {
      gameId: 2,
      homeTeamScore: 0,
      homeTeamQuarterScores: [0, 0, 0, 0, 0],
      awayTeamScore: 7,
      awayTeamQuarterScores: [0, 0, 0, 0, 7],
      overtime: true
    },
    {
      gameId: 3,
      homeTeamScore: 0,
      homeTeamQuarterScores: [0, 0, 0, 0],
      awayTeamScore: 0,
      awayTeamQuarterScores: [0, 0, 0, 0],
      overtime: false
    },
    {
      gameId: 4,
      homeTeamScore: 14,
      homeTeamQuarterScores: [0, 3, 0, 11],
      awayTeamScore: 7,
      awayTeamQuarterScores: [7, 0, 0, 0],
      overtime: false
    },
    {
      gameId: 5,
      homeTeamScore: 0,
      homeTeamQuarterScores: [0, 0, 0, 0],
      awayTeamScore: 7,
      awayTeamQuarterScores: [0, 0, 7, 0],
      overtime: false
    }
  ]

  await prisma.score.createMany({
    data: scores
  })

  /**
   * 로스터 생성
   */

  const rosters: Prisma.RosterCreateManyInput[] = [
    /**
     * team01 로스터
     */
    {
      name: '로스터01',
      globalName: 'roster01',
      registerYear: new Date('2018-01-01'),
      teamId: 1,
      rosterType: RosterType.Athlete,
      status: RosterStatus.Enable,
      accountId: 1
    },
    {
      name: '로스터02',
      globalName: 'roster02',
      registerYear: new Date('2019-01-01'),
      teamId: 1,
      rosterType: RosterType.Staff,
      status: RosterStatus.Enable,
      accountId: 2
    },
    {
      name: '로스터03',
      globalName: 'roster03',
      registerYear: new Date('2019-01-01'),
      teamId: 1,
      rosterType: RosterType.HeadCoach,
      status: RosterStatus.Enable,
      accountId: 3
    },
    {
      name: '로스터04',
      globalName: 'roster04',
      registerYear: new Date('2019-01-01'),
      teamId: 1,
      rosterType: RosterType.Athlete,
      status: RosterStatus.Enable,
      accountId: 4
    },
    /**
     * team02 로스터
     */
    {
      name: '로스터05',
      globalName: 'roster05',
      registerYear: new Date('2012-01-01'),
      teamId: 2,
      rosterType: RosterType.Athlete,
      status: RosterStatus.Verifying,
      accountId: 1
    },
    {
      name: '로스터06',
      globalName: 'roster06',
      registerYear: new Date('2005-01-01'),
      teamId: 2,
      rosterType: RosterType.Staff,
      status: RosterStatus.Verifying,
      accountId: 2
    },
    {
      name: '로스터07',
      globalName: 'roster07',
      registerYear: new Date('2005-01-01'),
      teamId: 2,
      rosterType: RosterType.Coach,
      status: RosterStatus.Enable
    },
    /**
     * team03 로스터
     */
    {
      name: '로스터08',
      globalName: 'roster08',
      registerYear: new Date('2005-01-01'),
      teamId: 3,
      rosterType: RosterType.Athlete,
      status: RosterStatus.Enable
    },
    {
      name: '로스터09',
      globalName: 'roster09',
      registerYear: new Date('2005-01-01'),
      teamId: 3,
      rosterType: RosterType.Staff,
      status: RosterStatus.Verifying,
      accountId: 2
    },
    {
      name: '로스터10',
      globalName: 'roster10',
      registerYear: new Date('2005-01-01'),
      teamId: 3,
      rosterType: RosterType.HeadCoach,
      status: RosterStatus.Verifying,
      accountId: 4
    }
  ]

  await prisma.roster.createMany({
    data: rosters
  })

  /**
   * 리그와 로스터 연결
   */

  const leagueRosters: Prisma.LeagueRosterCreateManyInput[] = [
    /**
     * team01의 로스터 와 league01 연결
     */
    {
      leagueId: 1,
      rosterId: 1
    },
    {
      leagueId: 1,
      rosterId: 2
    },
    {
      leagueId: 1,
      rosterId: 3
    }
  ]

  await prisma.leagueRoster.createMany({
    data: leagueRosters
  })

  const athletes: Prisma.AthleteCreateManyInput[] = [
    {
      position: {
        offence: 'OL',
        defense: 'LB'
      },
      backNumber: 1,
      height: 180,
      weight: 92,
      rosterId: 1
    },
    {
      position: {
        offence: 'WR',
        defense: 'DL'
      },
      backNumber: 2,
      height: 185,
      weight: 85,
      rosterId: 4
    },
    {
      position: {
        offence: 'QB',
        defense: 'RB'
      },
      backNumber: 1,
      height: 185,
      weight: 85,
      rosterId: 5
    },
    {
      position: {
        offence: 'QB',
        defense: 'RB'
      },
      backNumber: 1,
      height: 185,
      weight: 85,
      rosterId: 8
    }
  ]

  await prisma.athlete.createMany({
    data: athletes
  })

  /**
   * 로스터에 연결된 개인 정보 생성
   */

  const rosterCredentials: Prisma.RosterCredentialsCreateManyInput[] = [
    {
      name: 'USER_ONE',
      rosterId: 1,
      birthday: new Date('2000-01-01'),
      gender: GenderType.Male
    },
    {
      name: 'USER_TWO',
      rosterId: 2,
      birthday: new Date('2000-01-02'),
      gender: GenderType.Male
    },
    {
      name: 'USER_THREE',
      rosterId: 3,
      birthday: new Date('2000-01-03'),
      gender: GenderType.Male
    },
    {
      name: 'USER_FOUR',
      rosterId: 4,
      birthday: new Date('2000-01-04'),
      gender: GenderType.Male
    },
    {
      name: 'USER_ONE',
      rosterId: 5,
      birthday: new Date('2000-01-01'),
      gender: GenderType.Male
    },
    {
      name: 'USER_TWO',
      rosterId: 6,
      birthday: new Date('2000-01-02'),
      gender: GenderType.Male
    },
    {
      name: 'USER_THREE',
      rosterId: 7,
      birthday: new Date('2000-01-03'),
      gender: GenderType.Male
    },
    {
      name: 'USER_THREE',
      rosterId: 8,
      birthday: new Date('2000-01-03'),
      gender: GenderType.Male
    },
    {
      name: 'USER_TWO',
      rosterId: 9,
      birthday: new Date('2000-01-02'),
      gender: GenderType.Male
    },
    {
      name: 'USER_FOUR',
      rosterId: 10,
      birthday: new Date('2000-01-04'),
      gender: GenderType.Male
    }
  ]

  await prisma.rosterCredentials.createMany({
    data: rosterCredentials
  })

  /**
   * 경기 기록 데이터
   */
  const records: Prisma.RecordCreateManyInput[] = [
    {
      gameId: 1,
      rosterId: 1,
      score: 2,
      type: RecordType.Passer,
      unit: 'TouchDown'
    },
    {
      gameId: 1,
      rosterId: 1,
      score: 4,
      type: RecordType.Kicker,
      unit: 'PAT'
    },
    {
      gameId: 1,
      rosterId: 1,
      score: 1,
      type: RecordType.Kicker,
      unit: 'FieldGoal'
    },
    {
      gameId: 2,
      rosterId: 1,
      score: 2,
      type: RecordType.Passer,
      unit: 'TouchDown'
    },
    {
      gameId: 2,
      rosterId: 1,
      score: 4,
      type: RecordType.Kicker,
      unit: 'PAT'
    },
    {
      gameId: 2,
      rosterId: 1,
      score: 1,
      type: RecordType.Kicker,
      unit: 'FieldGoal'
    }
  ]

  await prisma.record.createMany({
    data: records
  })

  const posts: Prisma.PostCreateManyInput[] = [
    {
      title: '일반 게시글 테스트 01',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 02',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 03',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 04',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 05',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 06',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 07',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 08',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 09',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 10',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 11',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '일반 게시글 테스트 12',
      accountId: 1,
      type: PostType.Normal,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '공지사항 테스트 01',
      accountId: 14,
      type: PostType.Notice,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '공지사항 테스트 02',
      accountId: 14,
      type: PostType.Notice,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '공지사항 테스트 03',
      accountId: 14,
      type: PostType.Notice,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '공지사항 테스트 04',
      accountId: 14,
      type: PostType.Notice,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    },
    {
      title: '공지사항 테스트 05',
      accountId: 14,
      type: PostType.Notice,
      content: `<h2>텍스트 테스트</h2><h3>텍스트 테스트</h3><h4>텍스트 테스트</h4><p><strong>텍스트 테스트</strong></p><p>&nbsp;</p><p><i>텍스트 테스트</i></p><p>&nbsp;</p><p>텍스트 테스트</p><p>&nbsp;</p><ul><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ul><p>&nbsp;</p><ol><li>리스트 테스트</li><li>리스트 테스트</li><li>리스트 테스트</li></ol><p>링크 테스트</p><p><a href="https://dev.kafa.one">https://dev.kafa.one</a></p><p>&nbsp;</p><p>임베드 테스트</p><figure class="media"><oembed url="https://youtu.be/ICHaqUIy-8I?si=z5Zg4J0pKbq7p2aK"></oembed></figure><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>표</td><td>테</td><td>스</td><td>트</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>표</td><td>테</td><td>스</td><td>트</td></tr></tbody></table></figure>`
    }
  ]

  await prisma.post.createMany({
    data: posts
  })

  const comments: Prisma.CommentCreateManyInput[] = [
    {
      accountId: 1,
      content: 'comment 01',
      postId: 1
    },
    {
      accountId: 1,
      content: 'comment 02',
      postId: 1
    },
    {
      accountId: 1,
      content: 'comment 03',
      postId: 1
    },
    {
      accountId: 1,
      content: 'comment 04',
      postId: 1
    },
    {
      accountId: 1,
      content: 'comment 05',
      postId: 1
    }
  ]

  await prisma.comment.createMany({
    data: comments
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
