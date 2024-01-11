import { Tab } from '@headlessui/react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface CommentEditorParam {
  onSubmitComment: (comment: string) => void
}

const CommentEditor: React.FC<CommentEditorParam> = ({ onSubmitComment }) => {
  const [comment, setComment] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCommentChange = (e: any) => {
    setComment(e.target.value)
  }

  return (
    <div>
      <Tab.Group>
        <Tab.Panels>
          <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
            <label htmlFor="comment" className="sr-only">
              Comment
            </label>
            <div>
              <textarea
                rows={5}
                name="comment"
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                className="block w-full rounded-md border-0 px-2 py-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="여기에 댓글을 입력해주세요"
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <div className="mt-2 flex justify-end">
        <button
          onClick={() => onSubmitComment(comment)}
          className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-indigo-900 sm:text-sm"
        >
          <PaperAirplaneIcon
            className="-ml-0.5 mr-1.5 h-3 w-3 text-white sm:h-4 sm:w-4"
            aria-hidden="true"
          ></PaperAirplaneIcon>
          보내기
        </button>
      </div>
    </div>
  )
}

export default CommentEditor
