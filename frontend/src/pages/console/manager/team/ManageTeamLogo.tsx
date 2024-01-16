import axiosInstance from '@/commons/axios'
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

const ManageTeamLogo = () => {
  const [teamId, setTeamId] = useState()
  const [team, setTeam] = useState<TeamComplication>()
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
    } catch (error) {
      console.log(error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      processFile(file)
    } else {
      console.error('No file selected.')
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
      console.error('Invalid file or file size too large.')
    }
  }

  const uploadTeamLogo = async () => {
    if (!selectedFile) {
      console.error('No image selected for upload.')
      return
    }

    const formData = new FormData()
    formData.append('image', selectedFile) // 필드명을 'image'로 변경

    try {
      const response = await axiosInstance.post(
        `/profile/team/${teamId}`,
        formData
      )
      console.log('Upload successful:', response.data)
      setImagePreviewUrl(null)
      setSelectedFile(null)
      if (teamId) {
        window.alert('로고가 등록되었습니다.')
        getTeam(teamId)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Image upload failed!')
    }
  }

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">팀 로고 관리</div>
      <div className="mb-5 bg-white p-5">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          로고
        </label>
        {team?.profileImgUrl ? (
          <img
            src={team.profileImgUrl}
            alt="Team Logo"
            className="mx-auto w-40"
          />
        ) : (
          <p>등록된 로고가 없습니다.</p>
        )}
      </div>
      <div className="bg-white p-5">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          로고 이미지 업로드
        </label>
        <div
          className={`mt-2 flex justify-center rounded-lg border border-dashed ${
            isDragging ? 'border-indigo-600' : 'border-gray-900/25'
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
                className="mx-auto w-40"
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
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center">
          <button
            type="button"
            onClick={uploadTeamLogo}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageTeamLogo
