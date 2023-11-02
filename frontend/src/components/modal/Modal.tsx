// Modal.tsx
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { Fragment, useState, useRef } from 'react'

interface ModalProps {
  title: string
  content: string
  primaryButtonName: string
  secondaryButtonName?: string // 두 번째 버튼의 텍스트 (선택 사항)
  onPrimaryClick?: () => void // 주 버튼 클릭 이벤트 핸들러 (선택 사항)
  onSecondaryClick?: () => void // 두 번째 버튼 클릭 이벤트 핸들러 (선택 사항)
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  primaryButtonName,
  secondaryButtonName,
  onPrimaryClick,
  onSecondaryClick
}) => {
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick()
    }
    setOpen(false)
  }

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick()
    }
    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{content}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    secondaryButtonName
                      ? 'mt-5 flex space-x-2 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3'
                      : 'mt-5 sm:mt-6'
                  }
                >
                  <button
                    type="button"
                    className={
                      secondaryButtonName
                        ? 'inline-flex flex-1 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    }
                    onClick={handlePrimaryClick}
                  >
                    {primaryButtonName}
                  </button>
                  {secondaryButtonName && (
                    <button
                      type="button"
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={handleSecondaryClick}
                      ref={cancelButtonRef}
                    >
                      {secondaryButtonName}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  primaryButtonName: PropTypes.string.isRequired,
  secondaryButtonName: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func
}

export default Modal
