export interface FileHolderProps {
  disabled: boolean
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileHolder: React.FC<FileHolderProps> = ({
  disabled,
  handleFileChange
}) => {
  return (
    <div className="mb-4">
      <label
        className="mb-2 block text-sm font-medium text-gray-900"
        htmlFor="file_input"
      >
        파일
      </label>
      <input
        className="0 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <p
        className="mt-1 text-xs text-gray-500 sm:text-sm "
        id="file_input_help"
      >
        docs, txt, pdf, xlsx, hwp 형식의 파일만 업로드 가능합니다
      </p>
    </div>
  )
}

export default FileHolder
