// Stats.tsx
import DropdownSimple from '@/components/dropdown/DropdownSimple'
import DefaultTable from '@/components/tables/DefaultTable'

interface Person {
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

const options: Option[] = [
  { id: '1', name: 'Account settings' },
  { id: '2', name: 'Support' },
  { id: '3', name: 'License' },
  { id: '4', name: 'Sign out' }
]

const Stats = () => {
  const handleSelect = (selected: string) => {
    console.log('Selected option:', selected)
  }
  return (
    <div className="container mx-auto">
      <div className="container mx-auto grid max-w-screen-2xl px-5 sm:grid-cols-1 md:grid-cols-3">
        <div className="col-span-2">
          <div className="my-5">
            <DefaultTable title="경기일정" data={people} />
          </div>
        </div>
        <div className="col-span-1">
          <div className="my-5 ml-5">
            <DropdownSimple
              optionName="My Options"
              optionList={options}
              onSelect={handleSelect}
            />{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
