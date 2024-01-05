// PastMemberDetail.tsx
import MemberBanner from '@/components/cards/MemberBanner'
import DropdownSimple from '@/components/dropdown/DropdownLeft'
import WithSubtitleTable from '@/components/tables/WithSubtitleTable'

const member = {
  teamLogo: '/logo/KAFA_OG.png',
  teamName: 'TBD',
  name: '홍길동',
  profile: '/logo/KAFA_OG.png',
  age: 30,
  height: 180,
  weight: 90,
  backNumber: 90,
  position: 'OL/DL'
}

const people = [
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

const options = [
  { id: '1', name: 'Account settings' },
  { id: '2', name: 'Support' },
  { id: '3', name: 'License' },
  { id: '4', name: 'Sign out' }
]

const PastMemberDetail = () => {
  const handleSelect = (selected: string) => {
    console.log('Selected option:', selected)
  }
  return (
    <div className="">
      <MemberBanner {...member} />
      <div className="bg-indigo-800 p-6 text-xl text-white">
        {member.name} PERSONAL STATS
      </div>
      <div className="container mx-auto my-5 grid grid-cols-1 sm:grid-cols-3">
        <div className="order-2 col-span-1 mx-5 sm:order-1 sm:col-span-2">
          <div className="mb-5">
            <WithSubtitleTable
              title={'게임별 기록'}
              subtitle="TBD"
              data={people}
            />
          </div>
          <div>
            <WithSubtitleTable
              title={'리그 통산'}
              subtitle="TBD"
              data={people}
            />
          </div>
        </div>
        <div className="order-1 col-span-1 sm:order-2">
          <div className="mb-5 ml-5">
            <DropdownSimple
              optionName="My Options"
              optionList={options}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastMemberDetail
