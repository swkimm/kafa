interface History {
  id: number
  termBegins: number
  endOfTerm: number
  title: string
  name: string
}

const histories: History[] = [
  {
    id: 1,
    termBegins: 1946,
    endOfTerm: 1947,
    title: '초대 IOC위원',
    name: '전경무'
  },
  {
    id: 2,
    termBegins: 1947,
    endOfTerm: 1950,
    title: '재미올림픽후원회장',
    name: '차상달'
  },
  {
    id: 3,
    termBegins: 1951,
    endOfTerm: 1955,
    title: '4대 대통령 후보',
    name: '조병옥'
  },
  {
    id: 4,
    termBegins: 1955,
    endOfTerm: 1960,
    title: '연합통신 사장',
    name: '김동성'
  },
  {
    id: 5,
    termBegins: 1961,
    endOfTerm: 1963,
    title: '문공부장관',
    name: '임성희'
  },
  {
    id: 6,
    termBegins: 1964,
    endOfTerm: 1969,
    title: '사업가',
    name: '전한진'
  },
  {
    id: 7,
    termBegins: 1964,
    endOfTerm: 1969,
    title: '고려대 OB/체육인',
    name: '엄훈'
  },
  {
    id: 8,
    termBegins: 1973,
    endOfTerm: 1977,
    title: '예비역 장군',
    name: '남정환'
  },
  {
    id: 9,
    termBegins: 1977,
    endOfTerm: 1978,
    title: '제세실업 대표',
    name: '이장우'
  },
  {
    id: 10,
    termBegins: 1979,
    endOfTerm: 1980,
    title: '사업가',
    name: '조남진'
  },
  {
    id: 11,
    termBegins: 1980,
    endOfTerm: 1981,
    title: '고려대 OB/사업',
    name: '우창진'
  },
  {
    id: 12,
    termBegins: 1981,
    endOfTerm: 1985,
    title: '사업가',
    name: '유화진'
  },
  {
    id: 13,
    termBegins: 1985,
    endOfTerm: 1990,
    title: '성균관 OB/사업',
    name: '황교일'
  },
  {
    id: 14,
    termBegins: 1990,
    endOfTerm: 1999,
    title: '서울대 OB/학교재단',
    name: '강성봉'
  },
  {
    id: 15,
    termBegins: 1999,
    endOfTerm: 2003,
    title: '서울대 OB/사업',
    name: '최현두'
  },
  {
    id: 16,
    termBegins: 2003,
    endOfTerm: 2005,
    title: '성균관OB/사업',
    name: '강태선'
  },
  {
    id: 17,
    termBegins: 2005,
    endOfTerm: 2011,
    title: '서울대OB/경북대 교수',
    name: '박경규'
  },
  {
    id: 18,
    termBegins: 2011,
    endOfTerm: 2014,
    title: '고려대 OB/사업',
    name: '유인선'
  },
  {
    id: 19,
    termBegins: 2015,
    endOfTerm: 2018,
    title: '정치가/문인',
    name: '강요식'
  },
  {
    id: 20,
    termBegins: 2018,
    endOfTerm: 2020,
    title: '서울대 OB/사업',
    name: '남성남'
  },
  {
    id: 21,
    termBegins: 2021,
    endOfTerm: 2024,
    title: '연세대 OB/사업',
    name: '김호원'
  }
]

const Outline = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          협회소개
        </h3>
        <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
          대한미식축구협회를 소개합니다
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              개요
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              우리나라의 미식축구는 1945년 광복과 함께 도입되었다.
              <br />
              <br />
              그해 12월 6일 초대 대한민국 IOC 위원이신 故 정경무 님이 초대 대한
              미식축구협회 회장으로 취임하셨으며 故 조병욱 박사께서 후임 회장을
              지내셨다. 해방전 일본에서 미식축구를 접하셨던 張搏(와세다 대학),
              田以諾(메이지 대학), 全得秀(게이오 대학),崔仁衝(와세다 대학),
              朱元福 선생등과 같이 선수 및 코치로서 미식축구의 보급을 위해
              활약을 하셨던 분들의 희생과 노력이 오늘날 한국 미식축구의 기틀을
              마련하셨다.
              <br />
              <br />
              1947년 서울대학교 내의 문리과대학, 상과대학, 공과대학 사범대학 등
              단과대학을 중심으로 팀을 창단하였으나 장비 보급이 원활하지 않아
              별다른 활동을 하지 못한 채 한국전쟁으로 해체되었다. 이후 배재고,
              보인상고, 성복고, 인천선인고 등에 팀이 창설되었으나 역시 큰 활동
              없이 해체를 거듭하였다. 1957년 미국의 장비기증 등으로 성균관대학을
              시작으로 고려대, 서울대, 한양대, 경희대, 단국대 등 7개팀이
              창단되고 1962년에는 국내 최초로 미식축구대회를 개최하기에
              이르렀다.
              <br />
              <br />
              서울지역에만 머물던 미식축구는 1976년 영남지역 출신 OB들의
              헌신적인 노력으로 동아대학교를 필두로 부산, 경남지역과 대구,
              경북지역으로 확대되었고, 경기도 및 강원도, 충청도 지역으로
              보급되고 있다. 오늘날 40여개 대학팀, 5개의 사회인 팀, 30여개의
              플래그 풋볼 팀과 10개에 가까운 고교팀, 클럽팀으로 명실상부한 국내
              아마추어 스포츠의 최대 조직으로 성장하게 되었으며, 미식축구의
              효율적인 전국 보급을 위하여 대한미식축구협회 산하에 6개의
              지역협회가 있고 대구지부등 17개 시도지부로 보급을 하고 있으며,
              대학연맹, 사회인연맹, 플래그 풋볼 연맹, 유스연맹 등 4개의 전국규모
              연맹체가 연령별, 선수별 대회를 주최하고 팀들을 지도하고 있다.
              1946년 9월 5일 서울 YMCA에서 조선미식축구협회 창립총회 이후
              대한미식축구협회라는 명칭을 사용하던 협회는 1978년 명칭을
              한국아메리칸풋볼협회(Korea American Football Association, KAFA)로
              개칭하였으며 2001년 3월 다시 대한 미식축구협회(KAFA)로 환원하여
              현재에 이르고 있다. 또한 협회는 국제미식축구연맹(IFAF)의 가입과
              월드컵 출전권획득, 국제 대학스포츠연맹 FISU 대회, 유소년의
              미식축구 보급을 위한 플래그 풋볼 도입등 국제 무대에서의 지위를
              넓히고 있다.
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              역대 회장
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
                              임기
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              순서
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
                              출신
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {histories.map((history) => (
                            <tr key={history.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                {history.termBegins} - {history.endOfTerm}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {history.id}대
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {history.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {history.title}
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

export default Outline
