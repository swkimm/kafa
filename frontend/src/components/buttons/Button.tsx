// Button.tsx
import React from 'react'

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
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  label,
  icon,
  onClick,
  onClickPrev,
  onClickNext
}) => {
  let classes = 'px-4 py-2 transition duration-200 ease-in-out transform'

  let content = (
    <>
      {icon && <span>{React.isValidElement(icon) ? icon : null}</span>}
      {label && <span>{label}</span>}
      {/* {icon && <span>{icon}</span>}
      {label && <span>{label}</span>} */}
    </>
  )

  if (variant === 'prevNext') {
    classes += ' bg-gray-300 text-white hover:bg-gray-400'
    content = (
      <div className="flex">
        <button className={`${classes} rounded-l-lg`} onClick={onClickPrev}>
          Prev
        </button>
        <button className={`${classes} rounded-r-lg`} onClick={onClickNext}>
          Next
        </button>
      </div>
    )
  } else {
    switch (variant) {
      case 'roundFull':
        classes += ' rounded-full text-white bg-gray-600 hover:bg-gray-700'
        break
      case 'roundLg':
        classes += ' rounded-lg text-white bg-gray-600 hover:bg-gray-700'
        break
      case 'outlineWithDarkHover':
        classes +=
          ' border rounded-lg border-black hover:bg-gray-700 hover:text-white'
        break
      case 'outlineWhiteText':
        classes +=
          ' border rounded-lg border-white text-white hover:bg-gray-700 hover:text-white'
        break
      case 'outlineWithLightHover':
        classes += ' border rounded-lg border-gray-400 hover:bg-gray-100'
        break
      case 'reverse':
        classes += ' rounded-lg text-white bg-gray-600 hover:bg-gray-400'
        break
      case 'icon':
        classes +=
          ' flex rounded-lg items-center font-medium space-x-2 bg-gray-200 hover:bg-gray-300'
        break
      default:
        classes += ' text-white bg-gray-600 hover:bg-gray-700'
        break
    }
    content = (
      <button className={classes} onClick={onClick}>
        {icon && <span>{icon}</span>}
        {label && <span>{label}</span>}
      </button>
    )
  }

  return content
}

export default Button
