// src/common/PrivateRoute.tsx
import type { RootState } from '@/app/store'
import { setLoginState } from '@/features/auth/authSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// RootState 타입 가져오기
const PrivateRoute = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('token')
    if (token) {
      // 로그인 상태 업데이트
      dispatch(setLoginState({ isLoggedIn: true, token }))
    }
    setLoading(false) // 로딩 상태 해제
  }, [dispatch])

  if (isLoading) {
    return <div>Loading...</div> // 로딩 인디케이터 표시
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute
