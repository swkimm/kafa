import { PaperClipIcon } from '@heroicons/react/24/outline'

interface ExistFileHolderProps {
  id: number
  name: string
  url: string
  deleteFileHandler: (id: number) => void
}

const ExistFileHolder: React.FC<ExistFileHolderProps> = ({
  id,
  name,
  url,
  deleteFileHandler
}) => {
  return (
    <div key={id} className="py-1.5 text-sm">
      <div className="flex items-center">
        <PaperClipIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div className="ml-4 gap-2 text-gray-600">{name}</div>
        <div className="ml-4">
          <a
            href={url}
            className="font-medium text-indigo-900 hover:text-indigo-700"
            target="_blank"
            rel="noreferrer"
          >
            다운로드
          </a>
        </div>
        <div className="ml-4">
          <button
            className="font-medium text-amber-700 hover:text-amber-600"
            onClick={() => deleteFileHandler(id)}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExistFileHolder
