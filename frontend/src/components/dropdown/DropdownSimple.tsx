import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type React from 'react'
import { Fragment } from 'react'

interface Option {
  id: string | number
  name: string
}

interface SimpleProps {
  optionName?: string
  optionList?: Option[]
  onSelect?: (selected: string) => void
}

const classNames = (...classes: unknown[]): string => {
  return classes.filter(Boolean).map(String).join(' ')
}

const DropdownSimple: React.FC<SimpleProps> = ({
  optionName = 'Options',
  optionList = [],
  onSelect = () => {}
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {optionName}
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {optionList?.length > 0 ? (
              optionList.map((option) => (
                <Menu.Item key={option.id}>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => onSelect(option.name)} // 옵션이 선택되었을 때 콜백 함수 호출
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      {option.name}
                    </a>
                  )}
                </Menu.Item>
              ))
            ) : (
              <p>No options available</p>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DropdownSimple
