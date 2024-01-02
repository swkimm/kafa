// App.tsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './commons/PrivateRoute.tsx'
import ConsoleLayout from './commons/layout/ConsoleLayout.tsx'
import MainLayout from './commons/layout/MainLayout.tsx'
import { setLoginState } from './features/auth/authSlice.ts'
import AssociationHome from './pages/association/AssociationHome.tsx'
import AppealItem from './pages/association/items/AppealItem.tsx'
import Login from './pages/auth/Login.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import BoardHome from './pages/board/BoardHome.tsx'
import Calendar from './pages/calendar/Calendar.tsx'
import ConsoleHome from './pages/console/ConsoleHome.tsx'
import CreateGame from './pages/console/admin/game/CreateGame.tsx'
import CreateLeague from './pages/console/admin/league/CreateLeague.tsx'
import ManageLeague from './pages/console/admin/league/ManageLeague.tsx'
import CreateNational from './pages/console/admin/national/CreateNational.tsx'
import Home from './pages/huddle/Home.tsx'
import League from './pages/league/League.tsx'
import LeagueDetail from './pages/league/[id]/LeagueDetail.tsx'
import ScheduleDetail from './pages/league/[id]/schedule/[id]/ScheduleDetail.tsx'
import TeamDetail from './pages/league/[id]/team/[id]/TeamDetail.tsx'
import MemberDetail from './pages/league/[id]/team/[id]/member/[id]/MemberDetail.tsx'
import National from './pages/national/National.tsx'
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
          <Route path="/national" element={<National />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/board" element={<BoardHome />} />
          <Route path="/appeal" element={<AppealItem />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/leagues" element={<League />} />
          <Route path="/leagues/:leagueId" element={<LeagueDetail />} />
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
          <Route path="/pastLeague" element={<PastLeague />} />

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
          <Route path="/association" element={<AssociationHome />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route
          element={<PrivateRoute allowedRoles={['Admin', 'User', 'Manager']} />}
        >
          <Route element={<ConsoleLayout />}>
            <Route path="/console" element={<ConsoleHome />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route element={<ConsoleLayout />}>
            <Route path="/console/createLeague" element={<CreateLeague />} />
            <Route path="/console/manageLeague" element={<ManageLeague />} />
            <Route
              path="/console/league/:leagueId/createGame"
              element={<CreateGame />}
            />
            <Route
              path="/console/createNational"
              element={<CreateNational />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
