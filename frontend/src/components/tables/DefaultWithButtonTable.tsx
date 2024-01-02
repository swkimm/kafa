// DefaultWithButtonTable.tsx
import type React from 'react'

interface DefaultWithTableProps<T> {
  title: string
  data: T[]
  columns: ColumnProps<T>[]
  addButtonTitle?: string // 추가: 버튼의 텍스트
  onAddButtonClick?: () => void // 추가: 클릭 이벤트 핸들러
}

interface ColumnProps<T> {
  title: string
  render: (item: T) => React.ReactNode
}

const DefaultWithButtonTable = <T,>({
  title,
  data = [],
  columns = [],
  addButtonTitle = '버튼',
  onAddButtonClick
}: DefaultWithTableProps<T>) => {
  return (
    <div className="border bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex-auto">
          <div className="mt-5 border-l-8 border-black text-base font-semibold leading-6 text-gray-900">
            <div className="flex justify-between">
              <div className="ml-5">{title}</div>
              <button
                type="button"
                onClick={onAddButtonClick}
                className="mr-12 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {addButtonTitle}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="max-w-xs px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-4 text-sm text-gray-500"
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default DefaultWithButtonTable
