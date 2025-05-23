import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './commons/error/NotFound.tsx'
import { Role } from './commons/interfaces/account/profile.ts'
import ConsoleLayout from './commons/layout/ConsoleLayout.tsx'
import MainLayout from './commons/layout/MainLayout.tsx'
import PrivateRoute from './commons/layout/PrivateRoute.tsx'
import NotificationToast from './components/toast/notification/notification.tsx'
import useAuth from './hooks/useAuth.ts'
import Appeal from './pages/appeal/Appeal.tsx'
import AssociationHome from './pages/association/AssociationHome.tsx'
import EmailVerification from './pages/auth/EmailVerification.tsx'
import Login from './pages/auth/Login.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import { NoticeBoard } from './pages/board/NoticeBoard.tsx'
import PublicBoard from './pages/board/PublicBoard.tsx'
import Post from './pages/board/[id]/Post.tsx'
import EditPost from './pages/board/[id]/edit/EditPost.tsx'
import CreateNewPost from './pages/board/new/CreateNewPost.tsx'
import Calendar from './pages/calendar/Calendar.tsx'
import ConsoleHome from './pages/console/ConsoleHome.tsx'
import ManageAssociation from './pages/console/admin/association/ManageAssociation.tsx'
import CreateAssociation from './pages/console/admin/association/items/CreateAssociation.tsx'
import ModifyAssociation from './pages/console/admin/association/items/ModifyAssociation.tsx'
import ManageGame from './pages/console/admin/game/ManageGame.tsx'
import ManageGameDetail from './pages/console/admin/game/ManageGameDetail.tsx'
import CreateGame from './pages/console/admin/game/items/CreateGame.tsx'
import ModifyGame from './pages/console/admin/game/items/ModifyGame.tsx'
import ManageApply from './pages/console/admin/league/ManageApply.tsx'
import ManageLeague from './pages/console/admin/league/ManageLeague.tsx'
import ApplyDetail from './pages/console/admin/league/items/ApplyDetail.tsx'
import CreateLeague from './pages/console/admin/league/items/CreateLeague.tsx'
import ModifyLeague from './pages/console/admin/league/items/ModifyLeague.tsx'
import CreateRecode from './pages/console/admin/recode/CreateRecode.tsx'
import LeagueGame from './pages/console/admin/recode/league/[id]/LeagueGame.tsx'
import ManageScore from './pages/console/admin/recode/league/[id]/[id]/ManageScore.tsx'
import ManageTeams from './pages/console/admin/team/ManageTeams.tsx'
import MyProfile from './pages/console/common/MyProfile.tsx'
import ApplyLeague from './pages/console/manager/league/apply/ApplyLeague.tsx'
import JoinableLeagues from './pages/console/manager/league/joinable/JoinableLeagues.tsx'
import ValidateRoster from './pages/console/manager/league/validate/ValidateRoster.tsx'
import { CreateRoster } from './pages/console/manager/roster/create/CreateRoster.tsx'
import ManageRoster from './pages/console/manager/roster/list/ManageRoster.tsx'
import ManageRequestRoster from './pages/console/manager/roster/request/ManageRequestRoster.tsx'
import ManageTeamProfile from './pages/console/manager/team-profile/TeamProfile.tsx'
import Certification from './pages/console/user/certification/Certification.tsx'
import CreateTeam from './pages/console/user/create-team/CreateTeam.tsx'
import LoadRoster from './pages/console/user/roster/LoadRoster.tsx'
import GamePage from './pages/game/[id]/GamePage.tsx'
import Home from './pages/huddle/Home.tsx'
import League from './pages/league/League.tsx'
import LeagueDetail from './pages/league/[id]/LeagueDetail.tsx'
import National from './pages/national/National.tsx'
import RosterDetail from './pages/rostser/[id]/RosterDetail.tsx'
import Teams from './pages/team/Teams.tsx'
import TeamDetail from './pages/team/[id]/TeamDetail.tsx'
import TermHome from './pages/term/TermHome.tsx'

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
    <div className="font-custom">
      {/* Global Toasts */}
      <NotificationToast />

      {/* Route */}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/national" element={<National />} />
            <Route path="/board/notice" element={<NoticeBoard />} />
            <Route path="/board/public" element={<PublicBoard />} />
            <Route path="/board/posts/new" element={<CreateNewPost />} />
            <Route path="/board/posts/:id" element={<Post />} />
            <Route path="/board/posts/:id/edit" element={<EditPost />} />
            <Route path="/appeal" element={<Appeal />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/leagues" element={<League />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leagues/:leagueId" element={<LeagueDetail />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/rosters/:rosterId" element={<RosterDetail />} />
            <Route path="/games/:gameId" element={<GamePage />} />
            <Route path="/association" element={<AssociationHome />} />
            <Route path="/term" element={<TermHome />} />
          </Route>

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
              <Route path="/console/manage-league" element={<ManageLeague />} />
              <Route path="/console/create-league" element={<CreateLeague />} />
              <Route path="/console/modify-league" element={<ModifyLeague />} />

              <Route path="/console/manage-apply" element={<ManageApply />} />
              <Route path="console/apply-detail" element={<ApplyDetail />} />

              <Route path="/console/manage-game" element={<ManageGame />} />
              <Route
                path="/console/leagues/:leagueId/game-detail"
                element={<ManageGameDetail />}
              />
              <Route
                path="/console/leagues/:leagueId/create-game"
                element={<CreateGame />}
              />
              <Route
                path="/console/leagues/:leagueId/modify-game"
                element={<ModifyGame />}
              />
              <Route path="/console/create-recode" element={<CreateRecode />} />
              <Route
                path="/console/create-recode/leagues/:leagueId"
                element={<LeagueGame />}
              />
              <Route
                path="/console/create-recode/leagues/:leagueId/games/:gameId"
                element={<ManageScore />}
              />
              <Route
                path="/console/manage-association"
                element={<ManageAssociation />}
              />
              <Route
                path="/console/create-association"
                element={<CreateAssociation />}
              />
              <Route
                path="/console/modify-association"
                element={<ModifyAssociation />}
              />
              <Route path="/console/manage-teams" element={<ManageTeams />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={[Role.User]} />}>
            <Route element={<ConsoleLayout />}>
              <Route path="/console/roster" element={<LoadRoster />} />
              <Route path="/console/create-team" element={<CreateTeam />} />
              <Route
                path="/console/certification"
                element={<Certification />}
              />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={[Role.Manager]} />}>
            <Route element={<ConsoleLayout />}>
              <Route
                path="/console/manage-team-profile"
                element={<ManageTeamProfile />}
              />
              <Route
                path="/console/manage-request"
                element={<ManageRequestRoster />}
              />
              <Route path="/console/manage-roster" element={<ManageRoster />} />
              <Route
                path="/console/validate-roster"
                element={<ValidateRoster />}
              />
              <Route path="/console/create-roster" element={<CreateRoster />} />
              <Route
                path="/console/joinable-leagues"
                element={<JoinableLeagues />}
              />
              <Route path="/console/apply-league" element={<ApplyLeague />} />
            </Route>
          </Route>

          {/* Sign in Page */}
          <Route path="/login" element={<Login />} />

          {/* Sign up Page */}
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/signup/email-verification"
            element={<EmailVerification />}
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
