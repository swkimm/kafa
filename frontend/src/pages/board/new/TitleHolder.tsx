interface TitleHolderProps {
  title: string
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

const TitleHolder: React.FC<TitleHolderProps> = ({
  title,
  handleTitleChange,
  disabled
}) => {
  return (
    <>
      <div className="flex rounded-none shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-inset focus-within:ring-indigo-500">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          id="title"
          className="block flex-1 border border-gray-300 bg-white py-3 pl-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-base sm:leading-6"
          placeholder="이곳에 제목을 작성해주세요"
          disabled={disabled}
        />
      </div>
    </>
  )
}

export default TitleHolder
