import {
  type Prisma,
  PrismaClient,
  Role,
  AccountStatus,
  TeamEnrollStatus,
  TeamStatus
} from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const main = async function () {
  const accounts: Prisma.AccountCreateManyInput[] = [
    {
      username: 'user01',
      email: 'user01@example.com',
      role: Role.User,
      name: 'user01',
      password: await hash('1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'manager01',
      email: 'manager01@example.com',
      role: Role.Manager,
      name: 'manager01',
      password: await hash('1234'),
      status: AccountStatus.Enable
    },
    {
      username: 'admin01',
      email: 'admin01@example.com',
      role: Role.Admin,
      name: 'admin01',
      password: await hash('1234'),
      status: AccountStatus.Enable
    }
  ]

  await prisma.account.createMany({
    data: accounts
  })

  const associations: Prisma.AssociationCreateManyInput[] = [
    {
      name: 'association01',
      globalName: 'association01',
      initial: 'AONE'
    },
    {
      name: 'association02',
      globalName: 'association02',
      initial: 'ATWO'
    }
  ]

  await prisma.association.createMany({
    data: associations
  })

  const teams: Prisma.TeamCreateManyInput[] = [
    {
      name: 'team01',
      globalName: 'team01',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'seoul',
      initial: 'TONE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team02',
      globalName: 'team02',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'seoul',
      initial: 'TWO',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team03',
      globalName: 'team03',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'seoul',
      initial: 'TTHREE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team04',
      globalName: 'team04',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'seoul',
      initial: 'TFOUR',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team05',
      globalName: 'team05',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'busan',
      initial: 'TFIVE',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team06',
      globalName: 'team06',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'busan',
      initial: 'TSIX',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team07',
      globalName: 'team07',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'busan',
      initial: 'TSEVEN',
      status: TeamStatus.Enabled,
      associationId: 1
    },
    {
      name: 'team08',
      globalName: 'team08',
      color: '#ffffff',
      establishedAt: new Date('2000-01-01'),
      hometown: 'busan',
      initial: 'TEIGHT',
      status: TeamStatus.Disabled,
      associationId: 1
    }
  ]

  await prisma.team.createMany({
    data: teams
  })

  await prisma.account.update({
    where: {
      id: 2
    },
    data: {
      teamId: 1
    }
  })

  const registerTeamRequests: Prisma.RegisterTeamRequestCreateManyInput[] = [
    {
      accountId: 1,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team_r_01',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team_r_01',
        hometown: 'abc',
        initial: 'TeamROne',
        subColor: undefined
      },
      rejectReason: '',
      status: TeamEnrollStatus.Approved,
      username: 'team_r_01'
    },
    {
      accountId: 1,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team_r_02',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team_r_02',
        hometown: 'abc',
        initial: 'TeamRTwo',
        subColor: undefined
      },
      rejectReason: 'hello world',
      status: TeamEnrollStatus.Rejected,
      username: 'team_r_02'
    },
    {
      accountId: 1,
      createdAt: new Date('2023-01-01'),
      data: {
        name: 'team_r_03',
        associationId: 1,
        color: '#ffffff',
        establishedAt: new Date('2023-01-01'),
        globalName: 'team_r_03',
        hometown: 'abc',
        initial: 'TeamRThree',
        subColor: undefined
      },
      rejectReason: '',
      status: TeamEnrollStatus.Received,
      username: 'team_r_03'
    }
  ]

  await prisma.registerTeamRequest.createMany({
    data: registerTeamRequests
  })

  const leagues: Prisma.LeagueCreateManyInput[] = [
    {
      name: 'league01',
      startedAt: new Date('2023-01-01'),
      endedAt: new Date('2023-02-01')
    },
    {
      name: 'league02',
      startedAt: new Date('2023-02-01'),
      endedAt: new Date('2023-03-01')
    },
    {
      name: 'league03',
      startedAt: new Date('2023-02-01'),
      endedAt: new Date('2023-12-01')
    },
    {
      name: 'league04',
      startedAt: new Date('2023-01-01'),
      endedAt: new Date('2023-12-01')
    }
  ]

  await prisma.league.createMany({
    data: leagues
  })

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

  const leagueSponsers: Prisma.LeagueSponserCreateManyInput[] = [
    {
      leagueId: 1,
      sponserId: 1
    }
  ]

  await prisma.leagueSponser.createMany({
    data: leagueSponsers
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
