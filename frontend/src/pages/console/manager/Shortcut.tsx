import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const Shortcut: React.FC = () => {
  const navigate = useNavigate()

  const items = [
    {
      id: 1,
      name: '로스터 관리',
      href: '/console/manage-roster',
      icon: UserGroupIcon
    },
    {
      id: 2,
      name: '리그 신청 목록',
      href: '/console/apply-league',
      icon: ClipboardDocumentListIcon
    },
    {
      id: 3,
      name: '팀 정보 관리',
      href: '/console/manage-team-profile',
      icon: WrenchScrewdriverIcon
    }
  ]

  return (
    <div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200/60 bg-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <button
            key={item.id}
            className="flex flex-row items-center px-4 py-5 hover:bg-gray-200 sm:p-6"
            onClick={() => navigate(item.href)}
          >
            <dt className="text-sm font-normal">
              <item.icon
                className="h-6 w-6 shrink-0 text-purple-950"
                aria-hidden="true"
              />
            </dt>
            <dd className="mt-1 pl-1.5 text-gray-900">{item.name}</dd>
          </button>
        ))}
      </dl>
    </div>
  )
}

export default Shortcut
