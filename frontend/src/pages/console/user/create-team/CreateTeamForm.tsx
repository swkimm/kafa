export const CreateTeamForm: React.FC = () => {
  return (
    <>
      <div className="border-b border-gray-900/10 pb-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 계정에 사용할 아이디
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="usename"
                id="username"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이름 (국문)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="global-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이름 (영문)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="global-name"
                id="global-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="initial"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 이니셜 (대문자)
            </label>
            <div className="mt-2">
              <input
                id="initial"
                name="initial"
                type="initial"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="hometown"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              연고지
            </label>
            <div className="mt-2">
              <input
                id="hometown"
                name="hometown"
                type="hometown"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="association"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              소속협회
            </label>
            <div className="mt-2">
              <select
                id="association"
                name="association"
                autoComplete="association"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>서울미식축구협회</option>
                <option>경기강원미식축구협회</option>
                <option>대구경북미식축구협회</option>
                <option>부산울산경남미식축구협회</option>
                <option>사회인연맹</option>
                <option>플래그풋볼연맹</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="established-at"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              창단연도
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="established-at"
                id="established-at"
                autoComplete="established-at"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="color"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 메인 컬러
            </label>
            <div className="mt-2">
              <input
                id="color"
                name="color"
                type="color"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="sub-color"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              팀 서브 컬러
            </label>
            <div className="mt-2">
              <input
                id="sub-color"
                name="sub-color"
                type="color"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-row-reverse">
        <button className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm">
          신청하기
        </button>
      </div>
    </>
  )
}
