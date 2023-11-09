import DefaultTable from './DefaultTable'

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

const OtherComponent = () => {
  return (
    <div>
      <DefaultTable title="Other Table Title" data={people} />
    </div>
  )
}

export default OtherComponent
