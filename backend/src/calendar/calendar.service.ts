import { Injectable } from '@nestjs/common'
import { UnexpectedException } from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import type { CalendarDTO, CalendarGameItem } from './dto/calendar.dto'

@Injectable()
export class CalendarService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async getCalendarGamesByDateRange(
    start: Date,
    end: Date
  ): Promise<CalendarDTO<CalendarGameItem>[]> {
    try {
      const games = await this.prismaSerivce.game.findMany({
        where: {
          AND: [
            {
              startedAt: {
                gte: start
              }
            },
            {
              startedAt: {
                lte: end
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          startedAt: true,
          stadium: true,
          homeTeam: {
            select: {
              id: true,
              name: true,
              initial: true,
              profileImgUrl: true
            }
          },
          awayTeam: {
            select: {
              id: true,
              name: true,
              initial: true,
              profileImgUrl: true
            }
          },
          League: {
            select: {
              name: true
            }
          }
        }
      })

      return games.map((game) => {
        return {
          thumbnail: `${game.homeTeam.initial} vs ${game.awayTeam.initial}`,
          date: game.startedAt,
          item: {
            id: game.id,
            name: game.name,
            leagueName: game.League.name,
            stadium: game.stadium,
            homeTeamName: game.homeTeam.name,
            homeTeamProfileUrl: game.homeTeam.profileImgUrl,
            awayTeamName: game.awayTeam.name,
            awayTeamProfileUrl: game.awayTeam.profileImgUrl
          } as CalendarGameItem
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
