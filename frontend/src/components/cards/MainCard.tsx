interface MainCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  transparent: boolean
  more?: () => void
}

const MainCard: React.FC<MainCardProps> = ({
  title,
  subtitle,
  children,
  more,
  transparent
}) => {
  const getClassNames = (condition: boolean) => {
    let classNames =
      'overflow-hidden border-b border-t border-gray-200/60 sm:rounded-lg sm:border'
    if (condition) {
      classNames += ' bg-transparent'
    } else {
      classNames += ' bg-white shadow-lg'
    }
    return classNames
  }

  return (
    <>
      <div className="flex px-4 py-2">
        <div className="flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        {more ? (
          <div className="ml-16 mt-0 flex-none">
            <button
              type="button"
              onClick={more}
              className="font-base text-xs text-gray-500 hover:text-gray-400"
            >
              더 보기
            </button>
          </div>
        ) : null}
      </div>
      <div className={getClassNames(transparent)}>
        <div className="px-4">
          <div className="flow-root">{children}</div>
        </div>
      </div>
    </>
  )
}

export default MainCard
