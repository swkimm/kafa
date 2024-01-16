// import axiosInstance from '@/commons/axios'
// import type { ApiResponse } from '@/commons/interfaces/roster/rosterAvaliablity'
// import { useEffect, useState } from 'react'

const ValidateCerti = () => {
  // const [validation, setValidation] = useState<ApiResponse[]>([])

  // const getValidateCerti = async () => {
  //   try {
  //     const response = await axiosInstance.get<ApiResponse[]>(
  //       `/leagues/rosters/validation`
  //     )
  //     setValidation(response.data)
  //     console.log(response.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   getValidateCerti()
  // }, [])

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">인증서 검증</div>
      <div className="bg-white p-5">
        {/* {Array.isArray(validation) &&
          validation.map((val, index) => <div key={index}></div>)} */}
      </div>
    </div>
  )
}

export default ValidateCerti
