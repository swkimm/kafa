// PastTeamStatsItem.tsx
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import WithSubtitleTable from '@/components/tables/WithSubtitleTable'

interface Person {
  id: number
  name: string
  title: string
  email: string
  role: string
}

interface Option {
  id: string | number
  name: string
}

const people: Person[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 2,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 3,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

const options: Option[] = [
  { id: '1', name: 'Account settings' },
  { id: '2', name: 'Support' },
  { id: '3', name: 'License' },
  { id: '4', name: 'Sign out' }
]

const PastTeamStatsItem = () => {
  const handleSelect = (selected: string) => {
    console.log('Selected option:', selected)
  }
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3">
      <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
        <div className="my-5">
          <WithSubtitleTable
            title="경기일정"
            subtitle="vs Phoenix"
            data={people}
          />
        </div>
      </div>
      <div className="order-1 col-span-1 sm:order-2">
        <div className="ml-5 mt-5 sm:mb-5">
          <DropdownSimple
            optionName="My Options"
            optionList={options}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default PastTeamStatsItem
