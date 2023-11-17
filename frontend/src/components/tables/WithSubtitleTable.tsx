// WithSubtitleTable.tsx
import type React from 'react'

interface WithSubtitleTableProps {
  title: string
  subtitle: string
  data: Person[]
}

interface Person {
  name: string
  title: string
  email: string
  role: string
}

const WithSubtitleTable: React.FC<WithSubtitleTableProps> = ({
  title,
  subtitle,
  data
}) => {
  return (
    <div className="border ">
      <div className="sm:flex sm:items-center">
        <div className="border-b border-l-8 border-l-black bg-white p-5 sm:flex-auto">
          <div className="flex items-center border-black text-base font-semibold leading-6 text-gray-900">
            <div className="">{title}</div>
            <div className="ml-3 text-sm text-gray-500">{subtitle}</div>
          </div>
        </div>
      </div>
      <div className="flow-root overflow-x-auto bg-white px-2 sm:px-2 lg:px-4">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Column1
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Column2
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Column3
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Column4
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((person, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.role}
                    </td>
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
