// src/common/PrivateRoute.tsx
import type { RootState } from '@/app/store'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, Outlet } from 'react-router-dom'

// RootState 타입 가져오기

const PrivateRoute = () => {
  const location = useLocation()
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  if (!isLoggedIn) {
    // 사용자가 로그인하지 않았다면 로그인 페이지로 리디렉션
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet /> // 로그인한 사용자의 경우 해당 라우트의 컴포넌트를 렌더링
}

export default PrivateRoute
