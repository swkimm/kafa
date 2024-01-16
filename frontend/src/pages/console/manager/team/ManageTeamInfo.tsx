import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ManageTeamInfo = () => {
  const [teamId, setTeamId] = useState<number | undefined>()
  const [team, setTeam] = useState<TeamComplication>()
  const [globalName, setGlobalName] = useState('')
  const [name, setName] = useState('')
  const [hometown, setHometown] = useState('')
  const [initial, setInitial] = useState('')
  const [establishedAt, setEstablishedAt] = useState(new Date())
  const [color, setColor] = useState('')
  const [subColor, setSubColor] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axiosInstance.get(`/account/profile`)
        setTeamId(response.data.teamId)
      } catch (error) {
        console.log(error)
      }
    }
    getProfile().then(() => {
      if (teamId) {
        getTeam(teamId)
      }
    })
  }, [teamId])

  const getTeam = async (teamId: number) => {
    try {
      const response = await axiosInstance.get(`/teams/${teamId}`)
      console.log(response.data)
      setTeam(response.data)
      const year = response.data.establishedAt.substring(0, 4)
      setEstablishedAt(new Date(`${year}-01-01`))
    } catch (error) {
      console.log(error)
    }
  }

  const handleYearChange = (date: Date) => {
    // 연도만 선택하고, 저장 형식을 "YYYY-01-01"로 설정
    date.setMonth(0) // 0으로 설정하여 1월로 설정
    date.setDate(1) // 1로 설정하여 1일로 설정
    setEstablishedAt(date)
  }

  useEffect(() => {
    if (team) {
      setName(team.name)
      setGlobalName(team.globalName)
      setHometown(team.hometown)
      setInitial(team.initial)
      setColor(team.color)
      setSubColor(team.subColor ?? '')

      const year = new Date(team.establishedAt).getFullYear()
      setEstablishedAt(new Date(`${year}-01-01`)) // 연도만 설정
    }
  }, [team])

  const modifyTeamInfo = async () => {
    const formattedEstablishedAt = `${establishedAt.getFullYear()}-${(
      establishedAt.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${establishedAt.getDate().toString().padStart(2, '0')}`

    const modifyData = {
      name: name,
      globalName: globalName,
      hometown: hometown,
      initial: initial,
      establishedAt: formattedEstablishedAt,
      color: color,
      subColor: subColor
    }

    try {
      console.log(modifyData)
      const response = await axiosInstance.put(`/teams/profile`, modifyData)
      console.log(response.data)
      console.log(response.status)
      window.alert('수정되었습니다.')
      if (teamId) {
        getTeam(teamId)
      }
    } catch (error) {
      console.log(error)
      window.alert('알 수 없는 오류가 발생했습니다.')
    }
  }

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">팀 정보 관리</div>

      <div className="bg-white p-5">
        <div className="border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>팀 정보 수정</div>
        </div>
        <div className="mt-5 grid grid-cols-6 gap-y-3">
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              팀명
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={name}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              팀명(영문)
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={globalName}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setGlobalName(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              연고지
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={hometown}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setHometown(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              이니셜
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={initial}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setInitial(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              창단연도
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <DatePicker
              selected={establishedAt}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className="rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              메인컬러
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={color}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              서브컬러
            </label>
          </div>
          <div className="col-span-5 flex items-center">
            <input
              value={subColor}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setSubColor(e.target.value)}
            />
          </div>
          <div className="col-span-6 mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={modifyTeamInfo}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              팀 정보 수정
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageTeamInfo
