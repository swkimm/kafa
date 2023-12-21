interface ChildAssociation {
  id: number
  initial: string
  associationName: string
  leader: string
  email: string
}

const childAssociation: ChildAssociation[] = [
  {
    id: 1,
    initial: 'KNFL',
    associationName: '사회인연맹',
    leader: '신경창',
    email: 'national@kafa.org'
  },
  {
    id: 2,
    initial: 'KCAF',
    associationName: '대학연맹',
    leader: '강보성',
    email: 'collage@kafa.org'
  },
  {
    id: 3,
    initial: 'KYFF',
    associationName: '유스연맹',
    leader: '한재익',
    email: 'youth@kafa.org'
  },
  {
    id: 4,
    initial: 'KFFF',
    associationName: '플래그풋볼연맹',
    leader: '최창림',
    email: 'flagfootball@kafa.org'
  }
]

const committee: ChildAssociation[] = [
  {
    id: 1,
    initial: 'KAFGC',
    associationName: '경기위원회',
    leader: '한재익',
    email: 'games@kafa.org'
  },
  {
    id: 2,
    initial: 'KAFROC',
    associationName: '경기규칙국제위원회',
    leader: '김성일',
    email: 'rule@kafa.org'
  },
  {
    id: 3,
    initial: 'KAIFIC',
    associationName: '경기력향상위원회',
    leader: '석진우',
    email: 'improvement@kafa.org'
  },
  {
    id: 4,
    initial: 'KAFPC',
    associationName: '선수위원회',
    leader: '서인호',
    email: 'players@kafa.org'
  },
  {
    id: 5,
    initial: 'KAFWC',
    associationName: '여성위원회',
    leader: '김정민',
    email: 'women@kafa.org'
  },
  {
    id: 6,
    initial: 'KAFFPC',
    associationName: '스포츠공정위원회',
    leader: '신철호',
    email: 'fairplay@kafa.org'
  },
  {
    id: 7,
    initial: 'KAFA',
    associationName: '교육 및 공정위원회',
    leader: '백성일',
    email: 'atong75@hanmail.net'
  }
]

const OrganizationItem = () => {
  return (
    <div className="container mx-auto mt-5">
      <div className="text-2xl font-bold">조직도</div>

      <div className="my-5">
        <img src="/association/kafaOrganization.jpeg" alt="" />
      </div>

      <div className="text-2xl font-bold">산하 연맹</div>
      <div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center"></div>
          <div className="my-5 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                      >
                        이니셜
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        연맹
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        이름
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        이메일
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {childAssociation.map((child) => (
                      <tr key={child.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {child.initial}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.associationName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.leader}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-2xl font-bold">위원회</div>
      <div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center"></div>
          <div className="my-5 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                      >
                        이니셜
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        연맹
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        이름
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        이메일
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {committee.map((child) => (
                      <tr key={child.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {child.initial}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.associationName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.leader}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {child.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationItem
