import { printPosition } from '@/commons/functions/position/position.print'
import { printRosterType } from '@/commons/functions/roster-type/roster-type.print'
import { type Roster, RosterType } from '@/commons/interfaces/roster/roster'
import { UserIcon } from '@heroicons/react/24/outline'

interface RosterCardProps {
  roster: Roster
}

const RosterCard: React.FC<RosterCardProps> = ({ roster }) => {
  return (
    <div className="relative isolate flex h-64 w-full flex-col justify-end overflow-hidden rounded-lg bg-gray-900 px-3 pb-3 shadow-xl md:h-72 lg:h-80 lg:px-4 lg:pb-5">
      {roster.profileImgUrl ? (
        <img
          src={roster.profileImgUrl}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <UserIcon className="absolute inset-0 -z-10 h-full w-full object-cover text-gray-400" />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
      <div className="absolute inset-0 -z-10 rounded-lg ring-1 ring-inset ring-gray-900/10" />
      <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
        <span className="absolute inset-0" />
        <div className="flex flex-col">
          {roster.Team && (
            <div className="flex flex-row gap-x-2">
              <p className="-mb-2 text-[11px] font-light sm:-mb-0.5 lg:text-xs">
                {roster.Team.name}
              </p>
            </div>
          )}
          <div>
            {roster.rosterType === RosterType.Athlete ? (
              <>
                <h1 className="-mb-1 text-[14px] font-medium sm:mb-1 sm:text-lg">{`#${roster.Athlete?.backNumber} ${roster.name}`}</h1>
                <p className="text-[10px] font-normal text-gray-200 lg:text-xs">
                  {printPosition(roster.Athlete?.position)}
                </p>
              </>
            ) : (
              <p>
                <>
                  <h1 className="-mb-1 text-[14px] font-medium sm:mb-1 sm:text-lg">
                    {roster.name}
                  </h1>
                  <p className="text-[10px] font-normal text-gray-200 lg:text-xs">
                    {printRosterType(roster.rosterType)}
                  </p>
                </>
              </p>
            )}
          </div>
        </div>
      </h3>
    </div>
  )
}

export default RosterCard
