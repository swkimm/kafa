import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Fragment, useRef, useState } from 'react'
import DropdownLeft from '../dropdown/DropdownLeft'

interface RejectModalWithInputAndDropboxProps {
  onClose: () => void
  onSubmit: (reason: string, type: string) => Promise<void>
  isOpen: boolean
  options: { id: number; name: string }[]
}

const RejectModalWithInputAndDropbox: React.FC<
  RejectModalWithInputAndDropboxProps
> = ({ onClose, onSubmit, isOpen, options }) => {
  const [inputData, setInputData] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const cancelButtonRef = useRef(null)

  const handleDeactivateClick = async () => {
    await onSubmit(inputData, selectedStatus)
    onClose()
  }

  const handleDropdownSelect = (selected: string) => {
    setSelectedStatus(selected)
  }

  return (
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        거절 사유 입력
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="mt-5">
                    <DropdownLeft
                      optionName={selectedStatus}
                      optionList={options}
                      onSelect={handleDropdownSelect}
                    />
                    <input
                      type="text"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="거절 사유를 입력하세요"
                      className="mt-3 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDeactivateClick}
                    >
                      거절
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      ref={cancelButtonRef}
                      onClick={onClose}
                    >
                      취소
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default RejectModalWithInputAndDropbox
