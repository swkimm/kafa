// NewsCard.tsx
import PropTypes from 'prop-types'
import type React from 'react'

export interface NewsCardProps {
  imageSrc: string
  title: string
  description: string
  variant?: 'wide' | 'narrow'
  onClick?: () => void
}

const NewsCard: React.FC<NewsCardProps> = ({
  imageSrc,
  title,
  description,
  variant = 'wide',
  onClick
}) => {
  const isWide = variant === 'wide'

  return (
    <div
      className={`rounded-xs mx-auto max-w-md overflow-hidden bg-white px-5 shadow-md ${
        isWide ? '' : 'max-w-xs'
      }`}
      onClick={onClick}
    >
      <div
        className={`w-full ${
          isWide ? 'h-48' : 'h-32'
        } flex items-center justify-center bg-gray-200`}
      >
        {imageSrc ? (
          <img
            className="h-full w-full object-cover"
            src={imageSrc}
            alt="News Image"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className={`p-4 ${isWide ? 'p-8' : ''}`}>
        <h2 className="w-full break-words text-xl font-semibold">{title}</h2>
        <p className="w-full break-words">{description}</p>
      </div>
    </div>
  )
}

NewsCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['wide', 'narrow']),
  onClick: PropTypes.func
}

export default NewsCard
