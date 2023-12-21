// src/common/PrivateRoute.tsx
import type { RootState } from '@/app/store'
import Alert from '@/components/notifications/Alert'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

interface PrivateRouteProps {
  allowedRoles: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  if (!isLoggedIn) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    navigate('/login')
  }

  if (!allowedRoles.includes(role)) {
    // 허용되지 않은 역할인 경우 경고 메시지 표시
    navigate('/login')
    return (
      <div>
        <Alert
          title="접근 제한"
          content="이 페이지에 접근할 권한이 없습니다."
        />
      </div>
    )
  }

  return <Outlet />
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}

export default PrivateRoute
