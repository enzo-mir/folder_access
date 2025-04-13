import { useForm, usePage } from '@inertiajs/react'
import React, { ComponentRef, useRef } from 'react'
import { addFileSchema } from '../../app/validator/file.schema'
import { toast } from 'react-toastify'
import { z } from 'zod'

const AddPath = ({
  newPath,
  setNewPath,
}: {
  newPath: 'file' | 'folder'
  setNewPath: React.Dispatch<React.SetStateAction<'file' | 'folder' | null>>
}) => {
  const refButton = useRef<ComponentRef<'button'>>(null)
  const refInput = useRef<ComponentRef<'input'>>(null)
  const path = usePage().url.split('/dashboard/')[1] || ''

  const { data, setData, post } = useForm<{
    fileName?: string
    direName?: string
  }>({
    fileName: undefined,
    direName: undefined,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await addFileSchema.parseAsync(data)
      post(`/upload${path ? '/' + path : ''}`, {
        onSuccess: () => {
          setNewPath(null)
          toast.success(`${newPath} created !`)
        },
        onError: (e) => {
          toast.error(typeof e === 'string' ? e : 'An error as occurred')
        },
      })
    } catch (error) {
      console.log(error)

      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
  }

  return (
    <div
      onBlur={(e) => {
        if (e.relatedTarget === refButton.current || e.relatedTarget === refInput.current) return
        setNewPath(null)
      }}
    >
      <form onSubmit={handleSubmit} className="flex items-center justify-between mb-4">
        {newPath === 'file' ? (
          <>
            <input
              type="text"
              autoFocus
              placeholder="New file name"
              ref={refInput}
              value={data.fileName}
              onChange={(e) => setData({ ...data, fileName: e.target.value })}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              ref={refButton}
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create File
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              autoFocus
              required
              ref={refInput}
              placeholder="New folder name"
              value={data.direName}
              onChange={(e) => setData({ ...data, direName: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              ref={refButton}
              type="submit"
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Folder
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default AddPath
