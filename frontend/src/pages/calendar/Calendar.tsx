import axiosInstance from '@/commons/axios'
import { useState, useEffect } from 'react'

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  const getLeaguesWithYear = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/leagues/years/${new Date().getFullYear()}?page=${page}&limit=${limit}`
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getLeaguesWithYear()
  }, [])

  const daysInWeek: string[] = ['일', '월', '화', '수', '목', '금', '토']

  useEffect(() => {
    generateCalendarDays(currentMonth)
  }, [currentMonth])

  const generateCalendarDays = (date: Date): void => {
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    // 이전 달의 마지막 날짜 계산
    const prevMonthEndDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate()

    // 이전 달의 날짜 채우기
    const days: Date[] = []
    for (let i = 0; i < startDay.getDay(); i++) {
      days.unshift(
        new Date(date.getFullYear(), date.getMonth() - 1, prevMonthEndDay - i)
      )
    }

    // 현재 달의 날짜 채우기
    for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }

    // 다음 달의 날짜 채우기
    const nextMonthStartDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    )
    for (let i = 1; days.length % 7 !== 0; i++) {
      days.push(
        new Date(
          nextMonthStartDay.getFullYear(),
          nextMonthStartDay.getMonth(),
          i
        )
      )
    }
    setCalendarDays(days)
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const goToPreviousMonth = (): void => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    setCurrentMonth(previousMonth)
  }

  const goToNextMonth = (): void => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    )
    setCurrentMonth(nextMonth)
  }

  const monthYearString = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`

  return (
    <div className="container mx-auto p-4">
      <div className="mb-10 grid grid-cols-5 items-center gap-x-2 ">
        <div className="col-span-3 text-right text-2xl font-extrabold">
          <span>{monthYearString}</span>
        </div>
        <div className="col-span-1 text-right">
          <button
            onClick={goToPreviousMonth}
            className="rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-700"
          >
            이전달
          </button>
        </div>
        <div className="col-span-1 text-left">
          <button
            onClick={goToNextMonth}
            className="rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-700"
          >
            다음달
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {daysInWeek.map((day) => (
          <div key={day} className="mb-5 font-bold">
            <div className="text-right">{day}</div>
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`relative cursor-pointer py-20 text-right ${isCurrentMonth(day) ? '' : 'text-gray-400'}`}
          >
            <div className="absolute right-0 top-0 mr-2 mt-2">
              {day.getDate() || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
