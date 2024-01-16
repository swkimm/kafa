import axiosInstance from '@/commons/axios'
import { RosterType, type Roster } from '@/commons/interfaces/roster/roster'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import CreateRosterModal from '@/components/modal/CreateRosterModal'
import ModifyModal from '@/components/modal/ModifyModal'
import Pagination from '@/components/pagination/Pagination'
import DefaultWithButtonTable from '@/components/tables/DefaultWithButtonTable'
// import DefaultTable from '@/components/tables/DefaultTable'
import { Dialog } from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ManageTeamRoster = () => {
  const [teamId, setTeamId] = useState<number | undefined>()
  const [member, setMember] = useState<Roster>()
  const [roster, setRoster] = useState<Roster[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [selectedRosterType, setSelectedRosterType] = useState('')
  const [name, setName] = useState('')
  const [globalName, setGlobalName] = useState('')
  const [registerYear, setRegisterYear] = useState(new Date())
  const [offence, setOffence] = useState<string | ''>('')
  const [defense, setDefense] = useState<string | ''>('')
  const [special, setSpecial] = useState<string | ''>('')
  const [backNumber, setBackNumber] = useState<number | ''>()
  const [height, setHeight] = useState<number | ''>()
  const [weight, setWeight] = useState<number | ''>()
  const limit = 10 // 한 페이지 당 항목 수

  const rosterTypeOptions = Object.keys(RosterType)
    .filter((key): key is keyof typeof RosterType => isNaN(Number(key)))
    .map((key) => ({
      id: RosterType[key as keyof typeof RosterType],
      name: key
    }))

  const handleRosterTypeSelect = (selectedType: string) => {
    setSelectedRosterType(selectedType)
  }

  const handleRegisterYearSelect = (date: Date) => {
    setRegisterYear(date || new Date())
  }

  const getTeamRosters = useCallback(
    async (teamId: number) => {
      try {
        const response = await axiosInstance.get(
          `/rosters/teams/${teamId}?page=${currentPage}&limit=${limit}`
        )
        setRoster(response.data) // 서버 응답 형식에 맞게 수정 필요
        const loadedItems = response.data.length
        const isLastPage = loadedItems < limit
        setTotalPages(currentPage + (isLastPage ? 0 : 1)) // currentPage 대신 page 사용
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    },
    [currentPage]
  )

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axiosInstance.get(`/account/profile`)
        setTeamId(response.data.teamId)
      } catch (error) {
        console.error(error)
      }
    }

    getProfile().then(() => {
      if (teamId) {
        getTeamRosters(teamId)
      }
    })
  }, [teamId, currentPage, getTeamRosters])

  const openRosterAddModal = () => {
    setShowAddModal(true)
  }

  const rosterAdd = () => {
    setShowAddModal(false)
    if (teamId) {
      getTeamRosters(teamId) // 로스터 추가 후 페이지 상태 유지
    }
  }

  const getRoster = async (id: number) => {
    try {
      const response = await axiosInstance.get<Roster>(`/rosters/${id}`)
      setMember(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (member) {
      setName(member.name)
      setGlobalName(member.globalName)
      setRegisterYear(
        member.registerYear ? new Date(member.registerYear) : new Date()
      )
      setSelectedRosterType(member.rosterType.toString())
      // 'Athlete' 타입 관련 필드 설정
      if (member.rosterType.toString() === 'Athlete' && member.Athlete) {
        setOffence(member.Athlete.position.offence || '')
        setDefense(member.Athlete.position.defense || '')
        setSpecial(member.Athlete.position.special || '')
        setHeight(member.Athlete.height || '')
        setWeight(member.Athlete.weight || '')
        setBackNumber(member.Athlete.backNumber || '')
      }
    }
  }, [member])

  const modifyMember = async (id: number) => {
    setShowModifyModal(true)
    getRoster(id)
  }

  const modifySubmit = async () => {
    const year = registerYear.getFullYear()
    const rosterId = member?.id
    const modifyData = {
      name: name,
      globalName: globalName,
      registerYear: year,
      rosterType: selectedRosterType,
      position: {
        offence: offence,
        defense: defense,
        special: special
      },
      height: height,
      weight: weight,
      backNumber: backNumber
    }

    try {
      console.log(modifyData)
      const response = await axiosInstance.put(
        `/rosters/${rosterId}`,
        modifyData
      )
      console.log(response.data)
      window.alert('수정이 완료되었습니다.')
      setShowModifyModal(false)
      if (teamId !== undefined) {
        getTeamRosters(teamId) // teamId가 유효한 경우에만 호출
      } else {
        console.error('Invalid teamId')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const closeModifyModal = () => {
    setShowModifyModal(false)
  }

  const deleteMember = async (id: number) => {
    if (window.confirm('삭제하시겠습니까?') && teamId) {
      try {
        await axiosInstance.delete(`rosters/${id}`)
        getTeamRosters(teamId) // 멤버 삭제 후 페이지 상태 유지
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (teamId) {
      getTeamRosters(teamId)
    }
  }

  const teamRosterColumns = [
    {
      title: '구분',
      render: (roster: Roster) => <span>{roster.rosterType}</span>
    },
    {
      title: '프로필',
      render: (roster: Roster) => (
        <div>
          {roster.profileImgUrl && roster.profileImgUrl !== null ? (
            <img
              src={roster.profileImgUrl}
              alt={roster.name}
              className="h-12 w-10"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="h-12 w-10" />
          )}
        </div>
      )
    },
    {
      title: '이름',
      render: (roster: Roster) => <span>{roster.name}</span>
    },
    {
      title: '포지션',
      render: (roster: Roster) => {
        if (roster.Athlete?.position) {
          const { offence, defense, special } = roster.Athlete.position
          const positions = [offence, defense, special]
            .filter(Boolean)
            .join('/')
          return <span>{positions}</span>
        }
        return null
      }
    },
    {
      title: '백넘버',
      render: (roster: Roster) => {
        if (roster.Athlete?.backNumber) {
          return <span>{roster.Athlete.backNumber}</span>
        }
        return null
      }
    },
    {
      title: '수정',
      render: (roster: Roster) => (
        <button
          type="button"
          onClick={() => modifyMember(roster.id)}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          수정
        </button>
      )
    },
    {
      title: '삭제',
      render: (roster: Roster) => (
        <button
          type="button"
          onClick={() => deleteMember(roster.id)}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          삭제
        </button>
      )
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">로스터 관리</div>
      <div className="bg-white">
        <DefaultWithButtonTable
          title={'로스터 관리'}
          data={roster}
          columns={teamRosterColumns}
          addButtonTitle="로스터 추가"
          onAddButtonClick={openRosterAddModal}
        />
      </div>
      <div className="mt-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>

      {showModifyModal && (
        <ModifyModal onClose={closeModifyModal} onSubmit={modifySubmit}>
          {/* 여기에 ModifyModal의 내용을 넣습니다 */}
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="mb-5 text-base font-semibold leading-6 text-gray-900"
            >
              로스터 수정
            </Dialog.Title>
            <div className="overflow-y-auto text-left">
              <div className="relative mb-5 grid grid-cols-6 items-center">
                <div className="col-span-2">타입</div>
                <div className="col-span-4 mb-2">
                  <DropdownLeft
                    optionName={selectedRosterType}
                    optionList={rosterTypeOptions}
                    onSelect={handleRosterTypeSelect}
                  />
                </div>
                <div className="col-span-2">입부 년도</div>
                <div className="col-span-4 mb-2">
                  <DatePicker
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    selected={registerYear}
                    onChange={handleRegisterYearSelect}
                    showYearPicker
                    dateFormat="yyyy" // 연도만 표시
                  />
                </div>
                <div className="col-span-2">이름</div>
                <div className="col-span-4 mb-2">
                  <input
                    value={name}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-span-2">이름(영문)</div>
                <div className="col-span-4 mb-2">
                  <input
                    type="text"
                    value={globalName}
                    onChange={(e) => setGlobalName(e.target.value)}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {selectedRosterType === 'Athlete' && (
                  <>
                    <div className="col-span-2">포지션</div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        placeholder="오펜스"
                        value={offence}
                        onChange={(e) => setOffence(e.target.value)}
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        placeholder="디펜스"
                        value={defense}
                        onChange={(e) =>
                          setDefense(
                            e.target.value === '' ? '' : e.target.value
                          )
                        }
                        className="ml-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        placeholder="스페셜"
                        value={special}
                        onChange={(e) =>
                          setSpecial(
                            e.target.value === '' ? '' : e.target.value
                          )
                        }
                        className="ml-4 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-2 gap-0"></div>
                    <div className="col-span-4 gap-0 text-sm text-gray-500">
                      예시: QB, LB, K
                    </div>
                    <div className="col-span-2">키(cm)</div>
                    <div className="col-span-4 mb-2">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) =>
                          setHeight(
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value, 10)
                          )
                        }
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-2">몸무게(kg)</div>
                    <div className="col-span-4 mb-2">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) =>
                          setWeight(
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value, 10)
                          )
                        }
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="col-span-2">백넘버</div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={backNumber}
                        onChange={(e) =>
                          setBackNumber(
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value, 10)
                          )
                        }
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* 예를 들어, selectedRoster의 데이터를 이용한 폼을 여기에 구현할 수 있습니다. */}
        </ModifyModal>
      )}

      {showAddModal && teamId && (
        <CreateRosterModal
          teamId={teamId}
          onClose={rosterAdd}
          onRosterAdded={() => getTeamRosters(teamId)}
        />
      )}
    </div>
  )
}

export default ManageTeamRoster
