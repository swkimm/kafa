// WithSubtitleTable.tsx
import type React from 'react'

interface WithSubtitleTableProps<T> {
  title: string
  subTitle: string
  data: T[]
  columns: ColumnProps<T>[]
}

interface ColumnProps<T> {
  title: string
  render: (item: T) => React.ReactNode
}

const WithSubtitleTable = <T,>({
  title,
  subTitle,
  data = [],
  columns = []
}: WithSubtitleTableProps<T>) => {
  return (
    <div className="w-full border">
      <div className="sm:flex sm:items-center">
        <div className="border-b border-l-8 border-l-black bg-white p-5 sm:flex-auto">
          <div className="flex items-center border-black text-base font-semibold leading-6 text-gray-900">
            <div className="">{title}</div>
            <div className="ml-3 text-sm text-gray-500">{subTitle}</div>
          </div>
        </div>
      </div>
      <div className="flow-root overflow-x-auto bg-white px-2 sm:px-2 lg:px-4">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
      </div>
    </div>
  )
}

export default WithSubtitleTable
