// Button.tsx

interface ButtonProps {
  variant?:
    | 'default'
    | 'roundLg'
    | 'roundFull'
    | 'outlineWithDarkHover'
    | 'outlineWhiteText'
    | 'outlineWithLightHover'
    | 'reverse'
    | 'prevNext'
    | 'icon'
  label?: string
  icon?: React.ReactNode
  onClick?: () => void
  onClickPrev?: () => void
  onClickNext?: () => void
  isActive?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  label,
  icon,
  onClick,
  onClickPrev,
  onClickNext,
  isActive = false
}) => {
  let baseClasses = 'px-4 py-2 transition duration-200 ease-in-out transform'

  let activeClasses = ''
  if (isActive) {
    activeClasses = 'bg-white text-black'
  } else {
    activeClasses = 'bg-black text-white'
  }
  let content
  if (variant === 'prevNext') {
    // 'prevNext' 버튼 스타일
    const buttonClass = `${baseClasses} ${activeClasses} rounded-lg`
    content = (
      <div className="flex">
        <button className={`${buttonClass} rounded-l-lg`} onClick={onClickPrev}>
          Prev
        </button>
        <button className={`${buttonClass} rounded-r-lg`} onClick={onClickNext}>
          Next
        </button>
      </div>
    )
  } else {
    switch (variant) {
      case 'roundFull':
        baseClasses += ' rounded-full text-white bg-gray-600 hover:bg-gray-700'
        break
      case 'roundLg':
        baseClasses += ' rounded-lg text-white bg-gray-600 hover:bg-gray-700'
        break
      case 'outlineWithDarkHover':
        baseClasses +=
          ' border rounded-lg border-black hover:bg-gray-700 hover:text-white'
        break
      case 'outlineWhiteText':
        baseClasses +=
          ' border rounded-lg border-white hover:bg-gray-700 hover:text-white'
        break
      case 'outlineWithLightHover':
        baseClasses +=
          ' border rounded-lg text-black border-gray-400 hover:bg-gray-100'
        break
      case 'reverse':
        baseClasses +=
          ' rounded-lg border hover:bg-white hover:text-black hover:border-black'
        break
      case 'icon':
        baseClasses +=
          ' flex rounded-lg items-center font-medium space-x-2 bg-gray-200 hover:bg-gray-300'
        break
      default:
        baseClasses += ' text-white bg-gray-600 hover:bg-gray-700'
        break
    }
    const buttonClass = `${baseClasses} ${activeClasses}`
    content = (
      <button className={buttonClass} onClick={onClick}>
        {icon && <span>{icon}</span>}
        {label && <span>{label}</span>}
      </button>
    )
  }

  return content
}

export default Button
