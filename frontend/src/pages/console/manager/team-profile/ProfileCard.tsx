import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { ExclamationTriangleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'

interface FormType {
  name: string
  globalName: string
  initial: string
  hometown: string
  establishedAt: number
  color: string
  subColor?: string
}

const TeamProfileCard: React.FC = () => {
  const [teamId, setTeamId] = useState<number>()
  const [formData, setFormData] = useState<FormType>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>()
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [team, setTeam] = useState<TeamComplication>()

  const { showNotification } = useNotification()

  useEffect(() => {
    const getProfile = async () => {
      await axiosInstance.get(`/account/profile`).then((result) => {
        setTeam(result.data)
        setTeamId(result.data.teamId)
      })
    }

    getProfile().then(async () => {
      if (teamId) {
        await getTeam(teamId)
      }
    })
  }, [teamId])

  const getTeam = async (teamId: number) => {
    setIsSubmitting(true)
    await axiosInstance
      .get(`/teams/${teamId}`)
      .then((result: { data: TeamComplication }) => {
        setTeam(result.data)
        setFormData({
          name: result.data.name,
          globalName: result.data.globalName,
          initial: result.data.initial,
          hometown: result.data.hometown,
          establishedAt: new Date(result.data.establishedAt).getFullYear(),
          color: result.data.color,
          subColor: result.data.subColor ?? '#ffffff'
        })
      })
    setIsSubmitting(false)
  }

  const processFile = (file: File) => {
    if (file.type.startsWith('image/') && file.size <= 10485760) {
      // 10MB
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      console.error('잘못된 사진 형식 또는 사진이 10MB 보다 큼')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files && event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('No file selected.')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('사진이 선택되지 않음')
    }
  }

  const uploadTeamLogo = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    await axiosInstance
      .post(`/profile/team/${teamId}`, formData)
      .then(() => {
        setImagePreviewUrl(undefined)
        setSelectedFile(undefined)
      })
      .catch(() => {
        throw new Error('이미지 업로드 실패')
      })
  }

  const modifyTeamProfile = async () => {
    try {
      await uploadTeamLogo()

      await axiosInstance
        .put(`/teams/profile`, {
          ...formData,
          establishedAt: `${formData?.establishedAt}-01-01`
        })
        .then(() => {
          teamId && getTeam(teamId)
        })

      showNotification(
        NotificationType.Success,
        '업데이트 성공',
        '팀 정보가 업데이트 되었습니다'
      )
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '업데이트 실패',
        '팀 정보를 업데이트 하지 못했습니다',
        2000
      )
    }
  }

  return (
    <div>
      {formData && team && (
        <div className="mt-5 grid grid-cols-6 gap-y-3">
          <div className="col-span-6 grid grid-cols-6">
            <label
              htmlFor="cover-photo col-span-6 sm:col-span-1"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 로고
            </label>
            {team.profileImgUrl ? (
              <img
                src={team.profileImgUrl}
                alt="팀 로고"
                className="col-span-6 max-h-40 object-contain sm:col-span-5"
              />
            ) : (
              <div className="col-span-6 sm:col-span-5">
                <div className="flex flex-row items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-yellow-500" />
                  <p className="text-sm leading-6 text-gray-900">
                    등록된 로고가 없습니다
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-6 grid grid-cols-6 flex-row items-center">
            <label
              htmlFor="cover-photo col-span-6 sm:col-span-1"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              로고 변경
            </label>
            <div
              className={`col-span-6 mt-2 flex justify-center rounded-lg border border-dashed sm:col-span-5 ${
                isDragging ? 'border-indigo-900' : 'border-gray-300'
              } px-6 py-10`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded Image"
                    className="mx-auto max-h-40 object-contain"
                  />
                ) : (
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-950 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-900"
                  >
                    <span>파일 선택</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">또는 드래그앤 드랍</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF, WEBP up to 10MB
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              팀명
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              value={formData.name}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              팀명(영문)
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              value={formData.globalName}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
              onChange={(event) =>
                setFormData({ ...formData, globalName: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              연고지
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              value={formData.hometown}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
              onChange={(event) =>
                setFormData({ ...formData, hometown: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              이니셜
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              value={formData.initial}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
              onChange={(event) =>
                setFormData({ ...formData, initial: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              창단연도
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              className="block w-full rounded-md border-0 px-2 py-1.5 text-sm leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
              type="number"
              value={formData.establishedAt}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  establishedAt: parseInt(event.target.value, 10)
                })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              메인컬러
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              type="color"
              value={formData.color}
              className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              onChange={(event) =>
                setFormData({ ...formData, color: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 flex items-center sm:col-span-1">
            <label className="text-sm font-medium leading-6 text-gray-900">
              서브컬러
            </label>
          </div>
          <div className="col-span-6 flex items-center sm:col-span-5">
            <input
              type="color"
              value={formData.subColor}
              className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm sm:leading-6"
              onChange={(event) =>
                setFormData({ ...formData, subColor: event.target.value })
              }
            />
          </div>
          <div className="col-span-6 mt-5 flex flex-row-reverse">
            <button
              type="button"
              onClick={modifyTeamProfile}
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
            >
              수정하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamProfileCard
