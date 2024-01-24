export const getWeeksBetween = (startDate: Date, endDate: Date): number => {
  const adjustDay = (date: Date) => {
    const day = date.getDay()
    return day === 0 ? 6 : day - 1
  }

  const start = new Date(startDate)
  start.setDate(start.getDate() - adjustDay(start))
  const end = new Date(endDate)
  end.setDate(end.getDate() - adjustDay(end))

  const diffInDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )
  return Math.ceil(diffInDays / 7)
}
