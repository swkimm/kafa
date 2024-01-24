export const getStartAndEndDates = (
  startDate: Date,
  weekNumber: number
): { start: Date; end: Date } => {
  const start = new Date(startDate)
  adjustToMonday(start)

  start.setDate(start.getDate() + 7 * (weekNumber - 1))
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

const adjustToMonday = (date: Date) => {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
}
