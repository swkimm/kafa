// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/footer/Footer'
import Header from './components/header/Header.tsx'
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
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header />
        <div className="pt-15 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/league" element={<League />} />
            <Route path="/league/:leagueId" element={<LeagueDetail />} />
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
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
