import Alert from '@/components/notifications/Alert'
import { userState } from '@/state/userState'
import { Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import type { Role } from '../interfaces/account/profile'

interface PrivateRouteProps {
  allowedRoles: Role[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const user = useRecoilValue(userState)

  if (!user.isRoleLoaded) {
    return <div>Loading...</div>
  }

  if (!user.isLoggedIn || !allowedRoles.includes(user.role)) {
    return (
      <Alert title="접근 제한" content="이 페이지에 접근할 권한이 없습니다." />
    )
  }

  return <Outlet />
}

export default PrivateRoute
