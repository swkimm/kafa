import DefaultTable from '@/components/tables/DefaultTable'

interface People {
  id: number
  name: string
  title: string
  email: string
  role: string
}

const people: People[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    id: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
]

const noticeColumns = [
  {
    title: '#',
    render: (people: People) => <span>{people.id}</span>
  },
  {
    title: 'NAME',
    render: (people: People) => <span>{people.name}</span>
  },
  {
    title: 'TITLE',
    render: (people: People) => <span>{people.title}</span>
  },
  {
    title: 'EMAIL',
    render: (people: People) => <span>{people.email}</span>
  },
  {
    title: 'ROLE',
    render: (people: People) => <span>{people.role}</span>
  }
]

const NoticeItem = () => {
  return (
    <div>
      <div className="container mx-auto max-w-screen-xl px-4 lg:px-20">
        <div className="py-10">
          <DefaultTable
            title="공지사항"
            data={people}
            columns={noticeColumns}
          />
        </div>
      </div>
    </div>
  )
}

export default NoticeItem
