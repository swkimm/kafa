interface Contact extends ContactShort {
  shortend: string
  fullName: string
}

interface ContactShort {
  id: number
  email: string
  designation: string
}

const kafa: Contact[] = [
  {
    id: 1,
    email: 'kafa@kafa.org',
    designation: '대한미식축구협회',
    shortend: 'KAFA',
    fullName: 'Korea American Football Association'
  }
]

const chapters: Contact[] = [
  {
    id: 1,
    email: 'safa@kafa.org',
    designation: '대한미식축구 서울협회',
    shortend: 'SAFA',
    fullName: 'Seoul American Football Association'
  },
  {
    id: 2,
    email: 'gigafa@kafa.org',
    designation: '대한미식축구 경기인천강원협회',
    shortend: 'GGAFA',
    fullName: 'Gyeonggi Incheon Gangwon American Football Association'
  },
  {
    id: 3,
    email: 'tkafa@kafa.org',
    designation: '대한미식축구 대구경북협회',
    shortend: 'TKAFA',
    fullName: 'Daegu Gyeongbuk American Football Association'
  },
  {
    id: 4,
    email: 'bafa@kafa.org',
    designation: '대한미식축구 부산경남협회',
    shortend: 'BAFA',
    fullName: 'Busan Ulsan Gyeongnam American Football Association'
  },
  {
    id: 5,
    email: 'cafa@kafa.org',
    designation: '대한미식축구 충청협회',
    shortend: 'CAFA',
    fullName: 'Chung-Cheong American Football Association'
  },
  {
    id: 6,
    email: 'hjafa@kafa.org',
    designation: '대한미식축구 호남제주협회',
    shortend: 'HJAFA',
    fullName: 'Ho-Nam Jeju American Football Association'
  }
]

const federations: Contact[] = [
  {
    id: 1,
    email: 'flagfootball@kafa.org',
    designation: '대한미식축구 플래그풋볼연맹',
    shortend: 'KFFF',
    fullName: 'Korea Flag Football Federation'
  },
  {
    id: 2,
    email: 'youth@kafa.org',
    designation: '대한미식축구 유소년연맹',
    shortend: 'KYFF',
    fullName: 'Korea Youth Football Federation'
  },
  {
    id: 3,
    email: 'national@kafa.org',
    designation: '대한미식축구 사회인연맹',
    shortend: 'KNFF',
    fullName: 'Korea National Football Federation'
  },
  {
    id: 4,
    email: 'collage@kafa.org',
    designation: '대한미식축구 대학연맹',
    shortend: 'KCFF',
    fullName: 'Korea Collage Football Federation'
  }
]

const committees: Contact[] = [
  {
    id: 1,
    email: 'rule@kafa.org',
    designation: '경기규칙국제위원회',
    shortend: 'KAFROC',
    fullName: 'Korea American Football Rules & International Committee'
  },
  {
    id: 2,
    email: 'games@kafa.org',
    designation: '경기위원회',
    shortend: 'KAFGC',
    fullName: 'Korea American Football Games Committee'
  },
  {
    id: 3,
    email: 'improvement@kafa.org',
    designation: '경기력향상위원회',
    shortend: 'KAFIC',
    fullName: 'Korea American Football Improvement Committee'
  },
  {
    id: 4,
    email: 'players@kafa.org',
    designation: '선수위원회',
    shortend: 'KAFPC',
    fullName: '	Korea American Football Players Committee'
  },
  {
    id: 5,
    email: 'fairplay@kafa.org',
    designation: '스포츠공정위원회',
    shortend: 'KAFFPC',
    fullName: 'KoreaAmerican Football Fair Play Committee'
  },
  {
    id: 6,
    email: 'referee@kafa.org',
    designation: '심판위원회',
    shortend: 'KAFRC',
    fullName: 'Korea American Football Referee Committee'
  },
  {
    id: 7,
    email: 'women@kafa.org',
    designation: '여성위원회',
    shortend: 'KAFWC',
    fullName: 'Korea American Football Women Committee'
  },
  {
    id: 8,
    email: 'education@kafa.org',
    designation: '교육및공인위원회',
    shortend: 'KAFECC',
    fullName: 'Korea American Football Education & Certification Committee'
  }
]

const offices: ContactShort[] = [
  {
    id: 1,
    email: 'administrator@kafa.org',
    designation: '사무처장'
  },
  {
    id: 2,
    email: 'healthcare@kafa.org',
    designation: '보건의료국장'
  },
  {
    id: 3,
    email: 'media@kafa.org',
    designation: '미디어홍보국장'
  },
  {
    id: 4,
    email: 'contact@kafa.org',
    designation: '국제협력국장'
  },
  {
    id: 5,
    email: 'contact@kafa.org',
    designation: '국제협력담당관'
  },
  {
    id: 6,
    email: 'advisor@kafa.org',
    designation: '기술고문'
  },
  {
    id: 7,
    email: 'legal@kafa.org',
    designation: '법무과장'
  },
  {
    id: 8,
    email: 'account@kafa.org',
    designation: '예산회계과장'
  }
]

const ContactItem = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          CONTACT
        </h3>
        <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
          대한미식축구협회 연락처 모음
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              대한미식축구협회
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-mx-4 overflow-x-auto rounded-lg bg-white sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                              이메일
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              명칭
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              약어
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              영문
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {kafa.map((item) => (
                            <tr key={item.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.designation}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.shortend}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.fullName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              지역협회
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-mx-4 overflow-x-auto rounded-lg bg-white sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                              이메일
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              명칭
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              약어
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              영문
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {chapters.map((item) => (
                            <tr key={item.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.designation}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.shortend}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.fullName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              전국규모 연맹체
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-mx-4 overflow-x-auto rounded-lg bg-white sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                              이메일
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              명칭
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              약어
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              영문
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {federations.map((item) => (
                            <tr key={item.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.designation}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.shortend}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.fullName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              위원회
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-mx-4 overflow-x-auto rounded-lg bg-white sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                              이메일
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              명칭
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              약어
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              영문
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {committees.map((item) => (
                            <tr key={item.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.designation}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.shortend}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.fullName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              대한미식축구협회 사무국
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                  <div className="-mx-4 overflow-x-auto rounded-lg bg-white sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                            >
                              이메일
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              직책
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {offices.map((item) => (
                            <tr key={item.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.designation}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default ContactItem
