import { RosterStatus } from '@/commons/interfaces/roster/rosterStatus'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

interface RosterTypeDropDownProps {
  onChange: (status: RosterStatus) => void
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const items = [
  {
    name: '활성',
    value: RosterStatus.Enable
  },
  {
    name: '동문',
    value: RosterStatus.Graduate
  },
  {
    name: '비활성',
    value: RosterStatus.Disable
  }
]

const RosterTypeDropDown: React.FC<RosterTypeDropDownProps> = ({
  onChange
}) => {
  const [selected, setSelected] = useState(items[0])

  return (
    <Listbox
      value={selected}
      onChange={(item) => {
        onChange(item.value)
        setSelected(item)
      }}
    >
      {({ open }) => (
        <div className="relative mt-2 min-w-28">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-950 sm:text-sm sm:leading-6">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item) => (
                <Listbox.Option
                  key={item.name}
                  className={({ active }) =>
                    classNames(
                      active ? 'bg-indigo-950 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    )
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {item.name}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? 'text-white' : 'text-indigo-950',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

export default RosterTypeDropDown
