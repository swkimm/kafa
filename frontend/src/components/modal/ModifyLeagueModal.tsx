import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import { Dialog, Transition } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import PropTypes from 'prop-types'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DropdownLeft from '../dropdown/DropdownLeft'

interface ModifyModalProps {
  league: League
  onClose: (
    updatedLeague: League | null,
    notificationInfo?: {
      type: 'notification' | 'alert'
      title: string
      content: string
    }
  ) => void
}

const ModifyModal: React.FC<ModifyModalProps> = ({ league, onClose }) => {
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)
  const [associations, setAssociations] = useState<Association[]>([])
  const [selectedAssociationName, setSelectedAssociationName] = useState('')
  const [startedAt, setStartedAt] = useState<Date | null>(
    new Date(league.startedAt)
  )
  const [endedAt, setEndedAt] = useState<Date | null>(new Date(league.endedAt))
  const [leagueName, setLeagueName] = useState(league.name)

  const associationOptions = associations.map((assoc) => ({
    id: assoc.id,
    name: assoc.name
  }))

  const getAssociations = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Association[]>(
        '/associations?page=1&limit=100'
      )
      setAssociations(response.data)

      const initialAssociation = response.data.find(
        (assoc) => assoc.id === league.associationId
      )
      setSelectedAssociationName(initialAssociation?.name || '')
    } catch (error) {
      alert(error)
    }
  }, [league.associationId])

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  const associationSelect = (selected: string) => {
    setSelectedAssociationName(selected)
  }

  const handleUpdate = async () => {
    // Convert date strings to Date objects for type compatibility
    const updatedLeague: League = {
      id: league.id,
      name: leagueName,
      startedAt: startedAt ? new Date(startedAt) : new Date(), // Convert to Date
      endedAt: endedAt ? new Date(endedAt) : new Date(), // Convert to Date
      associationId:
        associations.find((a) => a.name === selectedAssociationName)?.id ??
        league.associationId
    }

    try {
      // Convert dates back to strings for API request
      const updatePayload = {
        name: updatedLeague.name,
        startedAt: updatedLeague.startedAt.toISOString().split('T')[0],
        endedAt: updatedLeague.endedAt.toISOString().split('T')[0],
        associationId: updatedLeague.associationId
      }

      await axiosInstance.put(`/admin/leagues/${league.id}`, updatePayload)
    } catch (error) {
      alert('대회 수정이 실패했습니다.')
    }
  }

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          static
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
                <Dialog.Panel className="relative transform overflow-hidden overflow-y-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <PencilSquareIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3  text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        대회 수정
                      </Dialog.Title>
                      <div>
                        <div className="mt-5 grid grid-cols-8 gap-y-3">
                          <div className="col-span-1 flex items-center">
                            <label
                              htmlFor="association"
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              협회
                            </label>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <DropdownLeft
                              optionName={selectedAssociationName}
                              optionList={associationOptions}
                              onSelect={associationSelect}
                            />
                          </div>
                          <div className="col-span-1 flex items-center">
                            <label
                              htmlFor="text"
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              대회명
                            </label>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <input
                              type="text"
                              value={leagueName}
                              onChange={(e) => setLeagueName(e.target.value)}
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="col-span-1 flex items-center">
                            <label
                              htmlFor="text"
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              대회 시작
                            </label>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <div className="">
                              <DatePicker
                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                selected={startedAt}
                                onChange={(date: Date) => setStartedAt(date)}
                              />
                            </div>
                          </div>
                          <div className="col-span-1 flex items-center">
                            <label
                              htmlFor="text"
                              className="text-sm font-medium leading-6 text-gray-900"
                            >
                              대회 종료
                            </label>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <DatePicker
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              selected={endedAt}
                              onChange={(date: Date) => setEndedAt(date)} // 날짜가 변경되면 상태 업데이트
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleUpdate}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => {
                        setOpen(false)
                        onClose(league) // 기존 리그 데이터를 그대로 전달
                      }}
                      ref={cancelButtonRef}
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

ModifyModal.propTypes = {
  league: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    startedAt: PropTypes.instanceOf(Date).isRequired,
    endedAt: PropTypes.instanceOf(Date).isRequired,
    associationId: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}
export default ModifyModal
