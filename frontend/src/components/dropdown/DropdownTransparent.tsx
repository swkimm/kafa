// DropdownTransparent.tsx
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type React from 'react'
import { useState, Fragment } from 'react'

interface Option {
  id: string | number
  name: string
}

interface SimpleProps {
  optionName?: string
  optionList?: Option[]
  onSelect?: (selected: number) => void
}

const classNames = (...classes: unknown[]): string => {
  return classes.filter(Boolean).map(String).join(' ')
}

const DropdownTransparent: React.FC<SimpleProps> = ({
  optionName = 'Options',
  optionList = [],
  onSelect = () => {}
}) => {
  const [selectedOption, setSelectedOption] = useState(optionName)

  const handleSelect = (optionId: number) => {
    const selectedOptionName =
      optionList.find((option) => option.id === optionId)?.name || 'Unknown'
    setSelectedOption(selectedOptionName)
    onSelect(optionId)
  }

  return (
    <Menu as="div" className="relative inline-table w-full text-left">
      <div>
        <Menu.Button className="inline-flex justify-center gap-x-28 truncate rounded-md bg-transparent px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
          {selectedOption}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {optionList?.length > 0 ? (
              optionList.map((option) => (
                <Menu.Item key={option.id.toString()}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        const id = parseInt(option.id.toString(), 10)
                        if (!isNaN(id)) {
                          handleSelect(id)
                        } else {
                          console.error('Invalid option ID:', option.id)
                        }
                      }}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block cursor-pointer px-4 py-2 text-sm'
                      )}
                    >
                      {option.name}
                    </div>
                  )}
                </Menu.Item>
              ))
            ) : (
              <p>없음</p>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DropdownTransparent
