import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

export interface ListboxOption {
  id: number
  name: string
}

interface LisxboxComponentProps {
  options: ListboxOption[]
  value: ListboxOption
  onChange: (option: ListboxOption) => void
}

const ListboxComponent: React.FC<LisxboxComponentProps> = ({
  options,
  onChange,
  value
}) => {
  const handleSelectionChange = (option: ListboxOption) => {
    onChange(option)
  }

  return (
    <div className="w-full">
      {options && (
        <Listbox
          value={value}
          onChange={(event) => handleSelectionChange(event)}
        >
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm">
              <span className="block truncate">{value.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {options.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-4 ${
                        active ? 'bg-indigo-950 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {option.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )}
    </div>
  )
}

export default ListboxComponent
