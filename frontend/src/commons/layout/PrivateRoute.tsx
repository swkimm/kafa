import { userState } from '@/state/userState'
import { Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Forbidden from '../error/Forbidden'
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
    return <Forbidden />
  }

  return <Outlet />
}

export default PrivateRoute
