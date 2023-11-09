import DefaultTable from '@/components/tables/DefaultTable'

interface Person {
  name: string
  title: string
  email: string
  role: string
}

// 다른 컴포넌트에서 사용할 데이터
const people: Person[] = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

const LeagueHomeItem = () => {
  return (
    <div className="container mx-auto grid max-w-screen-2xl grid-cols-3 px-5">
      <div className="col-span-2">
        <div className="mb-5">
          <DefaultTable title="다가오는 경기일정" data={people} />
        </div>
        <div className="mb-5">
          <DefaultTable title="최근경기 결과" data={people} />
        </div>
      </div>
    </div>
  )
}

export default LeagueHomeItem
