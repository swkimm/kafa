// GameTable.tsx
import type React from 'react'
import { useState } from 'react'
import DropdownRight from '../dropdown/DropdownRight'

interface GameTableProps {
  title: string
  games: {
    leagueName: string
    date: string
    homeTeam: {
      id: number
      logo: string
      name: string
      score: number
    }
    awayTeam: {
      id: number
      logo: string
      name: string
      score: number
    }
  }[]
}

const GameTable: React.FC<GameTableProps> = ({ title, games }) => {
  const [selectedLeague, setSelectedLeague] = useState('사회인연맹')
  const filteredGames = games.filter((game) =>
    selectedLeague === '사회인연맹' ? true : game.leagueName === selectedLeague
  )
  return (
    <div className="border bg-white">
      <div className="border sm:flex sm:items-center">
        <div className="border-b border-l-8 border-l-black p-5 sm:flex-auto">
          <div className="flex items-center justify-between border-black text-base font-semibold leading-6 text-gray-900">
            <div className="">{title}</div>
            <DropdownRight
              optionName={selectedLeague}
              optionList={[
                { id: 1, name: '대학연맹' },
                { id: 2, name: '플래그연맹' },
                { id: 3, name: '사회인연맹' }
              ]}
              onSelect={setSelectedLeague} // 콜백 함수 추가
            />
          </div>
        </div>
      </div>
      <div>
        {filteredGames.map((game, index) => (
          <div key={index} className="border-b">
            <div className="p-2">
              <div className="flex items-center justify-between p-2">
                <div className="flex">{game.leagueName}</div>
                <div className="flex">{game.date}</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    console.log(game.homeTeam.id)
                  }}
                >
                  <img
                    src={game.homeTeam.logo}
                    alt={`${game.homeTeam.logo}`}
                    className="mr-2 h-6" // add some margin-right and control height if needed
                  />
                  <div className="ml-3">{game.homeTeam.name}</div>
                </div>
                <div>{game.homeTeam.score}</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    console.log(game.awayTeam.id)
                  }}
                >
                  {' '}
                  <img
                    src={game.awayTeam.logo}
                    alt={`${game.awayTeam.logo}`}
                    className="mr-2 h-6" // add some margin-right and control height if needed
                  />
                  <div className="ml-3">{game.awayTeam.name}</div>
                </div>
                <div>{game.awayTeam.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameTable
