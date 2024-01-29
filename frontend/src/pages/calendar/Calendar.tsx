import axiosInstance from '@/commons/axios'
import { classNames } from '@/commons/functions/class-names/class-names'
import type {
  CalendarDTO,
  CalendarGameItem
} from '@/commons/interfaces/calendar/calendar'
import { useDate } from '@/hooks/useDate'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import moment, { type Moment } from 'moment'
import { useEffect, useState } from 'react'

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(moment())
  const [selectedDay, setSelectedDay] = useState(moment())
  const [days, setDays] = useState<
    {
      date: moment.Moment
      isCurrentMonth: boolean
      isToday: boolean
      isSelected: boolean
      events: CalendarDTO<CalendarGameItem>[]
    }[]
  >([])
  const [isFetching, setIsFetching] = useState(false)
  const [selectedDayEvent, setSelectedDayEvent] = useState<
    CalendarDTO<CalendarGameItem>[]
  >([])

  const { parseUTCDate, createLocalDate, toUTCString } = useDate()

  const generateDays = async () => {
    setIsFetching(true)
    const startDay = currentMonth.clone().startOf('month').startOf('week')
    const endDay = currentMonth.clone().endOf('month').endOf('week')
    const day = startDay.clone().subtract(1, 'day')
    const days = []

    const start = createLocalDate(
      `${currentMonth.format('YYYY')}-${currentMonth.format('MM')}-01`
    )
    const end = start.clone().endOf('month')

    const response = await axiosInstance.get<CalendarDTO<CalendarGameItem>[]>(
      `/calendar/games?start=${toUTCString(start)}&end=${toUTCString(end)}`
    )

    while (day.isBefore(endDay, 'day')) {
      days.push({
        date: day.add(1, 'day').clone(),
        isCurrentMonth: day.month() === currentMonth.month(),
        isToday: day.isSame(moment(), 'day'),
        isSelected:
          day.isSame(selectedDay, 'day') &&
          selectedDay.month() === currentMonth.month(),
        events: response.data.filter((game) =>
          day.isSame(parseUTCDate(game.date), 'day')
        )
      })
    }

    setDays(days)
    setIsFetching(false)
  }

  useEffect(() => {
    generateDays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth])

  useEffect(() => {
    setIsFetching(true)
    setSelectedDayEvent(
      days.filter((day) => day.date === selectedDay)[0]?.events
    )

    setDays(
      days.map((day) => ({
        ...day,
        isSelected: day.date.isSame(selectedDay, 'day')
      }))
    )
    setIsFetching(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay])

  useEffect(() => {
    const currentDayEvents = days.find((day) =>
      day.date.isSame(selectedDay, 'day')
    )?.events
    if (currentDayEvents) {
      setSelectedDayEvent(currentDayEvents)
    } else {
      setSelectedDayEvent([])
    }
  }, [days, selectedDay])

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'))
  }

  const handleToday = () => {
    setCurrentMonth(moment())
  }

  const handleDaySelect = (day: Moment) => {
    setSelectedDay(day)
  }

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime={currentMonth.format('YYYY-MM')}>
            {currentMonth.format('YYYY년 MM월')}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={handlePrevMonth}
              disabled={isFetching}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={handleToday}
              disabled={isFetching}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={handleNextMonth}
              disabled={isFetching}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="bg-white py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date.format('YYYY-MM-DD')}
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative min-h-[120px] px-3 py-2 hover:bg-gray-100'
                )}
                onClick={() => handleDaySelect(day.date)}
              >
                <time
                  dateTime={day.date.format('YYYY-MM-DD')}
                  className={classNames(
                    day.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-red-600 font-semibold text-white'
                      : '',
                    day.isSelected
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-950 font-semibold text-white'
                      : ''
                  )}
                >
                  {day.date.date()}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.map((event, index) => (
                      <li key={index}>
                        <div className="group flex">
                          <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                            {event.thumbnail}
                          </p>
                          <time
                            dateTime={parseUTCDate(event.date).format(
                              'YYYY-MM-DD'
                            )}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                          >
                            {parseUTCDate(event.date).format('A hh:mm')}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
          {/* Mobile view */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date.format('YYYY-MM-DD')}
                type="button"
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'font-semibold text-red-600' : '',
                  day.isSelected ? 'font-semibold text-indigo-600' : '',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
                )}
                onClick={() => handleDaySelect(day.date)}
              >
                <time
                  dateTime={day.date.format('YYYY-MM-DD')}
                  className="ml-auto"
                >
                  {day.date.date()}
                </time>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    <span className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto my-10 w-full max-w-screen-sm">
        {/* Selected day events */}
        <h2 className="text-center text-xl font-bold">
          {selectedDay.format('YYYY년 MM월 DD일')} 일정
        </h2>
        {selectedDayEvent && selectedDayEvent.length > 0 ? (
          <div className="w-full px-4 py-10">
            <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
              {selectedDayEvent.map((event, index) => (
                <li
                  key={index}
                  className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
                >
                  <div className="flex-auto">
                    <div className="text-xs font-medium text-gray-900">
                      {event.item?.leagueName}
                    </div>
                    <div className="mt-1 flex flex-row gap-x-4">
                      <div className="flex flex-row items-center gap-x-1">
                        {event.item?.homeTeamProfileUrl ? (
                          <img
                            src={event.item?.homeTeamProfileUrl}
                            alt="logo"
                            className="h-auto w-4"
                          />
                        ) : (
                          <img
                            src="/logo/KAFA_OG.png"
                            alt="logo"
                            className="h-auto w-4"
                          />
                        )}
                        <p>{event.item?.homeTeamName}</p>
                      </div>
                      <p>vs</p>
                      <div className="flex flex-row items-center gap-x-1">
                        {event.item?.awayTeamProfileUrl ? (
                          <img
                            src={event.item?.awayTeamProfileUrl}
                            alt="logo"
                            className="h-auto w-4"
                          />
                        ) : (
                          <img
                            src="/logo/KAFA_OG.png"
                            alt="logo"
                            className="h-auto w-4"
                          />
                        )}
                        <p>{event.item?.awayTeamName}</p>
                      </div>
                    </div>
                    <time
                      dateTime={parseUTCDate(event.date).format('A hh:mm')}
                      className="mt-2 flex items-center text-gray-700"
                    >
                      {parseUTCDate(event.date).format('A hh:mm')}
                      <p className="ml-3 text-gray-400">
                        {event.item?.stadium}
                      </p>
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mx-auto mt-5 flex w-full items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
            <p>일정이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendar
