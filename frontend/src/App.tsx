// App.tsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './commons/PrivateRoute.tsx'
import ConsoleLayout from './commons/layout/ConsoleLayout.tsx'
import MainLayout from './commons/layout/MainLayout.tsx'
import { setLoginState } from './features/auth/authSlice.ts'
import Login from './pages/auth/Login.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import ConsoleHome from './pages/console/ConsoleHome.tsx'
import RegisterLeague from './pages/console/league/RegisterLeague.tsx'
// import ProtectedComponent from './pages/auth/ProtectedComponent.tsx'
import Home from './pages/huddle/Home.tsx'
import League from './pages/league/League.tsx'
import LeagueDetail from './pages/league/[id]/LeagueDetail.tsx'
import ScheduleDetail from './pages/league/[id]/schedule/[id]/ScheduleDetail.tsx'
import TeamDetail from './pages/league/[id]/team/[id]/TeamDetail.tsx'
import MemberDetail from './pages/league/[id]/team/[id]/member/[id]/MemberDetail.tsx'
import Notice from './pages/notice/Notice.tsx'
import PastLeague from './pages/pastLeague/PastLeague.tsx'
import PastLeagueDetail from './pages/pastLeague/[id]/PastLeagueDetail.tsx'
import PastTeamDetail from './pages/pastLeague/[id]/team/PastTeamDetail.tsx'
import PastMemberDetail from './pages/pastLeague/[id]/team/[id]/member/[id]/PastMemberDetail.tsx'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(setLoginState({ isLoggedIn: true, token: token }))
    } else {
      dispatch(setLoginState({ isLoggedIn: false, token: null }))
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/league" element={<League />} />
          <Route path="/league/:leagueId" element={<LeagueDetail />} />
          <Route path="/pastLeague" element={<PastLeague />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/pastLeague/:pastLeagueId"
            element={<PastLeagueDetail />}
          />
          <Route
            path="/pastLeague/:pastLeagueId/team/:teamId"
            element={<PastTeamDetail />}
          />
          <Route
            path="/pastLeague/:pastLeagueId/team/:teamId/member/:memberId"
            element={<PastMemberDetail />}
          />
          <Route
            path="/league/:leagueId/team/:teamId"
            element={<TeamDetail />}
          />
          <Route
            path="/league/:leagueId/team/:teamId/member/:memberId"
            element={<MemberDetail />}
          />
          <Route
            path="/league/:leagueId/schedule/:gameid"
            element={<ScheduleDetail />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<ConsoleLayout />}>
            <Route path="/console" element={<ConsoleHome />} />
            <Route
              path="/console/registerLeague"
              element={<RegisterLeague />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
