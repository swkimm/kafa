// App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './commons/error/NotFound.tsx'
import { Role } from './commons/interfaces/account/profile.ts'
import ConsoleLayout from './commons/layout/ConsoleLayout.tsx'
import MainLayout from './commons/layout/MainLayout.tsx'
import PrivateRoute from './commons/layout/PrivateRoute.tsx'
import NotificationToast from './components/toast/notification/notification.tsx'
import useAuth from './hooks/useAuth.ts'
import AssociationHome from './pages/association/AssociationHome.tsx'
import AppealItem from './pages/association/items/AppealItem.tsx'
import Login from './pages/auth/Login.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import BoardHome from './pages/board/BoardHome.tsx'
import Post from './pages/board/[id]/Post.tsx'
import EditPost from './pages/board/[id]/edit/EditPost.tsx'
import CreateNewPost from './pages/board/new/CreateNewPost.tsx'
import Calendar from './pages/calendar/Calendar.tsx'
import ConsoleHome from './pages/console/ConsoleHome.tsx'
import CreateGame from './pages/console/admin/game/CreateGame.tsx'
import CreateLeague from './pages/console/admin/league/CreateLeague.tsx'
import ManageLeague from './pages/console/admin/league/ManageLeague.tsx'
import CreateNational from './pages/console/admin/national/CreateNational.tsx'
import CreateRecode from './pages/console/admin/recode/CreateRecode.tsx'
import ManageRecode from './pages/console/admin/recode/ManageRecode.tsx'
import MyProfile from './pages/console/common/MyProfile.tsx'
import EnrollLeague from './pages/console/manager/league/EnrollLeague.tsx'
import ValidateCerti from './pages/console/manager/league/ValidateCerti.tsx'
import ManageRequestRoster from './pages/console/manager/team/ManageRequestRoster.tsx'
import ManageTeamInfo from './pages/console/manager/team/ManageTeamInfo.tsx'
import ManageTeamLogo from './pages/console/manager/team/ManageTeamLogo.tsx'
import ManageTeamRoster from './pages/console/manager/team/ManageTeamRoster.tsx'
import LoadRoster from './pages/console/user/roster/LoadRoster.tsx'
import ApplyTeam from './pages/console/user/team/ApplyTeam.tsx'
import Home from './pages/huddle/Home.tsx'
import League from './pages/league/League.tsx'
import LeagueDetail from './pages/league/[id]/LeagueDetail.tsx'
import ScheduleDetail from './pages/league/[id]/schedule/[id]/ScheduleDetail.tsx'
import TeamDetail from './pages/league/[id]/team/[id]/TeamDetail.tsx'
import MemberDetail from './pages/league/[id]/team/[id]/member/[id]/MemberDetail.tsx'
import National from './pages/national/National.tsx'
import Notice from './pages/notice/Notice.tsx'

const App = () => {
  const { reloadCredential } = useAuth()

  useEffect(() => {
    const init = async () => {
      await reloadCredential()
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Global Toasts */}
      <NotificationToast />

      {/* Route */}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/national" element={<National />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/board" element={<BoardHome />} />
            <Route path="/board/posts/new" element={<CreateNewPost />} />
            <Route path="/board/posts/:id" element={<Post />} />
            <Route path="/board/posts/:id/edit" element={<EditPost />} />
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
            <Route path="/association" element={<AssociationHome />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route
            element={
              <PrivateRoute
                allowedRoles={[Role.Admin, Role.Manager, Role.User]}
              />
            }
          >
            <Route element={<ConsoleLayout />}>
              <Route path="/console" element={<ConsoleHome />} />
              <Route path="/console/profile" element={<MyProfile />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={[Role.Admin]} />}>
            <Route element={<ConsoleLayout />}>
              <Route path="/console/createLeague" element={<CreateLeague />} />
              <Route path="/console/manageLeague" element={<ManageLeague />} />
              <Route
                path="/console/league/:leagueId/createGame"
                element={<CreateGame />}
              />
              <Route path="/console/createRecode" element={<CreateRecode />} />
              <Route path="/console/manageRecode" element={<ManageRecode />} />

              <Route
                path="/console/createNational"
                element={<CreateNational />}
              />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={[Role.User]} />}>
            <Route element={<ConsoleLayout />}>
              <Route path="/console/applyTeam" element={<ApplyTeam />} />
              <Route path="/console/loadRoster" element={<LoadRoster />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={[Role.Manager]} />}>
            <Route element={<ConsoleLayout />}>
              <Route path="/console/manageTeam" element={<ManageTeamInfo />} />
              <Route path="/console/manageLogo" element={<ManageTeamLogo />} />
              <Route
                path="/console/manageRequest"
                element={<ManageRequestRoster />}
              />
              <Route
                path="/console/manageRoster"
                element={<ManageTeamRoster />}
              />
              <Route path="/console/enroll" element={<EnrollLeague />} />
              <Route
                path="/console/validateCerti"
                element={<ValidateCerti />}
              />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
