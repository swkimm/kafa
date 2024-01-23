import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface SearchRostersProps {
  disabled: boolean
  onSearch: (term: string) => void
}

const SearchRosters: React.FC<SearchRostersProps> = ({
  onSearch,
  disabled
}) => {
  const [term, setTerm] = useState('')
  return (
    <div className="flex flex-row items-center gap-x-2">
      <div>
        <input
          type="text"
          placeholder="검색어 입력"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSearch(term)
          }}
          className="block w-full rounded-md border-0 py-1.5 text-xs text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <button
          onClick={() => onSearch(term)}
          disabled={disabled}
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
          검색
        </button>
      </div>
    </div>
  )
}

export default SearchRosters
