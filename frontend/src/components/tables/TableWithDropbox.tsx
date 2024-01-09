// TableWithDropbox.tsx
import type React from 'react'
import DropdownRight from '../dropdown/DropdownRight'

interface Option {
  id: string | number
  name: string
}

interface TableWithDropboxProps<T> {
  title: string
  data: T[]
  columns: ColumnProps<T>[]
  dropdownOptions?: Option[]
  optionName?: string // Include the optionName as an optional property
}

interface ColumnProps<T> {
  title: string
  render: (item: T) => React.ReactNode
}

const TableWithDropbox = <T,>({
  title,
  data = [],
  columns = [],
  dropdownOptions = [], // 추가된 파라미터
  optionName // This prop should be accepted here
}: TableWithDropboxProps<T>) => {
  return (
    <div className="border bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex-auto">
          <div className="mt-5 border-l-8 border-black text-base font-semibold leading-6 text-gray-900">
            <div className="flex justify-between">
              <div className="ml-5">{title}</div>
              <div className="mr-10">
                <DropdownRight
                  optionList={dropdownOptions}
                  optionName={optionName}
                />
              </div>
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
export default TableWithDropbox
