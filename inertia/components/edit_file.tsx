import { useForm } from '@inertiajs/react'
import { useRef, useEffect } from 'react'
import { FiSave } from 'react-icons/fi'
import { toast } from 'react-toastify'

const EditFile = ({ content }: { content: string }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textarea = textareaRef.current
  const { data, setData, put, processing } = useForm({
    content,
  })

  const handleKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const value = textarea.value
        textarea.value = value.substring(0, start) + '\t' + value.substring(end)
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      handleSubmit(e as React.FormEvent)
    }
  }

  useEffect(() => {
    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown)
      }
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    put('', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('File saved successfully')
      },
      onError: (e) => {
        toast.error(typeof e === 'string' ? e : 'An error occurred while saving the file')
      },
    })
  }

  return (
    <section className="mt-4 grid place-items-center w-full">
      <form className="w-full max-w-4xl" onSubmit={handleSubmit}>
        <textarea
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          value={data.content}
          onChange={(e) => setData('content', e.target.value)}
          className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
        whitespace-pre-wrap
        transition-colors duration-200 resize-none"
          placeholder="No content..."
          defaultValue={content}
          spellCheck="false"
        />

        <div className="flex w-full justify-end space-x-3  p-4  max-w-4xl">
          <button
            type="button"
            onClick={() => setData('content', content)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={processing}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center 
            transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <FiSave className="mr-1" /> Save Settings
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditFile
