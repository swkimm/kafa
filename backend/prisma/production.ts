import {
  type Prisma,
  PrismaClient,
  Role,
  AccountStatus,
  type RosterType,
  RosterStatus,
  GenderType,
  type GameResult,
  type LeagueApplyStatus
} from '@prisma/client'
import { randomBytes } from 'crypto'
import * as fs from 'node:fs'

const prisma = new PrismaClient()

const seedProd = async function () {
  /**
   * 협회 정보 마이그레이션
   */

  const associations: Prisma.AssociationCreateManyInput[] = [
    {
      name: '대한미식축구협회',
      globalName: 'Korea American Foorball Association',
      initial: 'KAFA'
    },
    {
      name: '서울인천 미식축구협회',
      globalName: 'Seoul Incheon American Football Association',
      initial: 'SIAFA',
      parentId: 1
    },
    {
      name: '경기강원 미식축구협회',
      globalName: 'Gyeonggi Gangwon American Football Association',
      initial: 'GGAFA',
      parentId: 1
    },
    {
      name: '대구경북 미식축구협회',
      globalName: 'Daegu Gyeongbuk American Football Association',
      initial: 'TKAFA',
      parentId: 1
    },
    {
      name: '부산경남 미식축구협회',
      globalName: 'Busan Ulsan Gyeongnam American Football Association',
      initial: 'BAFA',
      parentId: 1
    },
    {
      name: '충청 미식축구협회',
      globalName: 'Chung-Cheong American Football Association',
      initial: 'CAFA',
      parentId: 1
    },
    {
      name: '호남제주 미식칙구협회',
      globalName: 'Ho-Nam Jeju American Football Association',
      initial: 'HJAFA',
      parentId: 1
    },
    {
      name: '사회인연맹',
      globalName: 'Korea National Football Federation',
      initial: 'KNFF',
      parentId: 1
    },
    {
      name: '플래그풋볼연맹',
      globalName: 'Korea Flag Football Federation',
      initial: 'KFFF',
      parentId: 1
    }
  ]

  await prisma.association.createMany({
    data: associations
  })

  /**
   * 팀 정보 마이그레이션
   */

  const teamData = fs.readFileSync('prisma/migration-data/teams.txt', 'utf-8')

  const teams = JSON.parse(teamData) as Prisma.TeamCreateManyInput[]

  await prisma.team.createMany({
    data: teams
  })

  const accountData = fs.readFileSync(
    'prisma/migration-data/accounts.txt',
    'utf-8'
  )

  const accountDataArray = JSON.parse(accountData) as {
    teamId: number
    name: string
    team: {
      name: string
    }
    username: string
    password: string
  }[]

  const accounts = accountDataArray.map((item) => ({
    username: item.username,
    password: item.password,
    email: `${randomBytes(5).toString('hex')}@example.com`,
    status: AccountStatus.Enable,
    role: Role.Manager,
    name: item.team?.name ?? 'team manager',
    teamId: item.teamId
  }))

  await prisma.account.createMany({
    data: accounts
  })

  /**
   * 로스터정보 마이그레이션
   */

  const rosterData = fs.readFileSync(
    'prisma/migration-data/rosters.txt',
    'utf-8'
  )

  const rosterDataArray = JSON.parse(rosterData) as {
    id: number
    teamId: number
    name: string
    backNumber: number
    registrationDate?: string
    type: RosterType
    weight: number
    height: number
    position: string[]
    profileImgUrl?: string
  }[]

  const rosters: Prisma.RosterCreateManyInput[] = rosterDataArray.map(
    (item) => ({
      id: item.id,
      name: item.name,
      globalName: 'global-name',
      registerYear: item.registrationDate
        ? item.registrationDate.substring(0, 4) + '-01-03T00:00:00Z'
        : '2023' + '-01-03T00:00:00Z',
      rosterType: item.type,
      profileImgUrl: item.profileImgUrl
        ? item.profileImgUrl.replace('playprove', 'kafa')
        : null,
      status: RosterStatus.Enable,
      teamId: item.teamId
    })
  )

  await prisma.roster.createMany({
    data: rosters
  })

  /**
   * 로스터 개인정보 마이그레이션
   */
  const rosterCredentials: Prisma.RosterCredentialsCreateManyInput[] =
    rosters.map((item) => ({
      rosterId: item.id,
      name: randomBytes(6).toString('hex'),
      birthday: '2024-01-29',
      gender: GenderType.Male
    }))

  await prisma.rosterCredentials.createMany({
    data: rosterCredentials
  })

  /**
   * 선수 정보 마이그레이션
   */

  const athleteDataArray = rosterDataArray.filter(
    (item) => item.type === 'Athlete'
  )

  const athletes: Prisma.AthleteCreateManyInput[] = athleteDataArray.map(
    (item) => ({
      rosterId: item.id,
      backNumber: item.backNumber ?? -1,
      height: item.height ?? 0,
      weight: item.weight ?? 0,
      position:
        item.position.length > 1
          ? { offence: item.position[0], defense: item.position[1] }
          : { offence: item.position[0] }
    })
  )

  await prisma.athlete.createMany({
    data: athletes
  })

  /**
   * 리그정보 마이그레이션
   */

  const leagues: Prisma.LeagueCreateManyInput[] = [
    {
      name: '추계 대학미식축구 선수권전(1부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 2
    },
    {
      name: '추계 대학미식축구 선수권전',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 3
    },
    {
      name: '추계 대학미식축구 선수권전(1부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 4
    },
    {
      name: '추계 대학미식축구 선수권전(1부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 5
    },
    {
      name: '제 28회 KNFL',
      startedAt: new Date('2023-08-26T15:00:00.000Z'),
      endedAt: new Date('2023-12-17T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 8
    },
    {
      name: '제 63회 타이거볼',
      startedAt: new Date('2023-11-03T15:00:00.000Z'),
      endedAt: new Date('2023-12-01T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 1
    },
    {
      name: '제 63회 챌린지볼',
      startedAt: new Date('2023-11-13T15:00:00.000Z'),
      endedAt: new Date('2023-12-01T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 1
    },
    {
      name: '추계 대학미식축구 선수권전(2부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 2
    },
    {
      name: '추계 대학미식축구 선수권전(2부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 4
    },
    {
      name: '추계 대학미식축구 선수권전(2부)',
      startedAt: new Date('2023-09-01T15:00:00.000Z'),
      endedAt: new Date('2023-10-14T14:59:59.999Z'),
      startedYear: 2023,
      associationId: 5
    }
  ]

  await prisma.league.createMany({
    data: leagues
  })

  /**
   * 팀의 리그 참여 정보 마이그레이션
   */
  const teamLeagueData = fs.readFileSync(
    'prisma/migration-data/team-league.txt',
    'utf-8'
  )

  const teamLeagues = JSON.parse(teamLeagueData) as {
    teamId: number
    leagueId: number
    applyStatus: LeagueApplyStatus
  }[]

  await prisma.teamLeague.createMany({
    data: teamLeagues
  })

  /**
   * 경기정보 마이그레이션
   */

  const gameData = fs.readFileSync('prisma/migration-data/games.txt', 'utf-8')

  const gameDataArray = JSON.parse(gameData) as {
    id: number
    homeTeamId: number
    homeTeamScore: number
    awayTeamId: number
    awayTeamScore: number
    leagueId: number
    name: string
    startedAt: string
    stadium: string
    result: GameResult
  }[]

  const games = gameDataArray.map((game) => ({
    id: game.id,
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    startedAt: new Date(
      new Date(game.startedAt).getTime() - 9 * 60 * 60 * 1000
    ),
    leagueId: game.leagueId,
    name: game.name,
    stadium: game.stadium,
    result: game.result
  }))

  await prisma.game.createMany({
    data: games
  })

  const scoresData = fs.readFileSync(
    'prisma/migration-data/scores.txt',
    'utf-8'
  )

  const scores = JSON.parse(scoresData)

  await prisma.score.createMany({
    data: scores
  })
}

export default seedProd
