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

// 1946-1947 1대 전경무 초대 IOC위원
// 1947-1950 2대 차상달 재미올림픽후원회장
// 1951-1955 3대 조병옥 4대 대통령 후보
// 1955-1960 4대 김동성 연합통신 사장
// 1961-1963 5대 임성희 문공부장관
// 1964-1969 6대 전한진 사업가
// 1969-1973 7대 엄훈 고려대 OB/체육인
// 1973-1977 8대 남정환 예비역 장군
// 1977-1978 9대 이장우 제세실업 대표
// 1979-1980 10대 조남진 사업가
// 1980-1981 11대 우창진 고려대 OB/사업
// 1981-1985 12대 유화진 사업가
// 1985-1990 13대 황교일 성균관 OB/사업
// 1990-1999 14대 강성봉 서울대 OB/학교재단
// 1999-2003 15대 최현두 서울대 OB/사업
// 2003-2005 16대 강태선 성균관OB/사업
// 2005-2011 17대 박경규 서울대OB/경북대 교수
// 2011-2014 18대 유인선 고려대 OB/사업
// 2015-2018 19대 강요식 정치가/문인
// 2018-2020 20대 남성남 서울대 OB/사업
// 2021-2024 21대 김호원 연세대 OB/사업

const HistoryItem = () => {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-5 lg:px-20 lg:py-10">
      <div className="mb-3 text-lg font-bold lg:text-2xl">연혁</div>
      <p className="text-sm font-normal lg:text-base">
        한국의 미식축구 역사는 미군정과 당시 대학들로부터 시작되었다. 6.25 전쟁
        이후 주둔한 미군의 영향으로 1950년대부터 연세대 등 미국 선교사들의
        영향이 짙었던 대학들을 위주로 빠르게 대학팀이 생겨 점차 전국으로
        퍼져나가기 시작했으며, 현재 전국 주요대학의 미식축구부들은 60년 이상의
        역사를 자랑한다. 이들 대학 팀들은 미8군과 교류전을 가지기도 했고
        1954년부터 1960년까지는 놀랍게도 전국체전 시범 종목이기까지 했다.
      </p>
      <div className="mt-5 text-lg font-bold lg:mt-8 lg:text-2xl">
        역대 회장
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-5 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="mb-5 min-w-full divide-y divide-gray-300 rounded-xl bg-white">
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
    </div>
  )
}
export default HistoryItem
