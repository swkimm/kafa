import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'

interface CreateRosterFormProps {
  selectedTeam: TeamSimple
}

export const CreateRosterForm: React.FC<CreateRosterFormProps> = ({
  selectedTeam
}) => {
  return (
    <div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          요청할 팀
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="text"
              name="team-name"
              id="team-name"
              value={selectedTeam.name}
              disabled={true}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          영문 이름
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="text"
              name="name"
              id="name"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          입부년도
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="number"
              name="register-year"
              id="register-year"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          구분
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="text"
              name="name"
              id="name"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          포지션
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="text"
              name="position"
              id="position"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          키 (cm)
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="number"
              name="position"
              id="position"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          몸무게 (kg)
        </label>
        <div className="mt-2">
          <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
            <input
              type="number"
              name="position"
              id="position"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRosterForm
