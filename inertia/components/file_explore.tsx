import React from 'react'
import { FilesType } from '../../app/types/files.type'
import { router } from '@inertiajs/react'
import { FiFile, FiFolder } from 'react-icons/fi'
import AddPath from './add_path'

const FileExplore = ({
  files,
  newPath,
  setNewPath,
  currentPath,
}: {
  files: FilesType
  newPath: 'file' | 'folder' | null
  currentPath: string
  setNewPath: React.Dispatch<React.SetStateAction<'file' | 'folder' | null>>
}) => {
  const normalizeSize = (size: number): string => {
    if (size <= 0) return '0 b'

    const units = ['b', 'kb', 'mb', 'gb', 'tb']
    const index = Math.min(Math.floor(Math.log2(size) / 10), units.length - 1)

    return `${(size / 1024 ** index).toFixed(2)} ${units[index]}`
  }

  return files.length ? (
    <section className="mt-4 grid place-items-center">
      <ul className="space-y-3 w-[80%]">
        {newPath ? <AddPath newPath={newPath} setNewPath={setNewPath} /> : null}
        {files.map((file, id) => (
          <li
            key={id}
            onClick={() =>
              router.visit(
                `/dashboard/${encodeURIComponent(currentPath ? currentPath + '/' + file.name : file.name)}`
              )
            }
            className={`flex items-center hover:cursor-pointer justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150`}
          >
            <div className="flex items-center space-x-4 min-w-0">
              {file.type === 'folder' ? (
                <FiFolder className="flex-shrink-0 text-yellow-500" size={20} />
              ) : (
                <FiFile className="flex-shrink-0 text-blue-500" size={20} />
              )}
              <p className="font-medium text-gray-800 truncate">{file.name}</p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {file.size !== null && (
                <span className="hidden sm:inline-block bg-gray-100 px-2 py-1 rounded-md text-xs">
                  {normalizeSize(file.size)}
                </span>
              )}
              {file.modified_at && (
                <span className="hidden md:inline-block">
                  {new Date(file.modified_at).toLocaleDateString('en', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  ) : newPath ? (
    <section className="mt-4 grid place-items-center">
      <ul className="space-y-3 w-[80%]">
        <AddPath newPath={newPath} setNewPath={setNewPath} />
      </ul>
    </section>
  ) : (
    <div className="mt-8 text-center py-12 rounded-lg bg-gray-50">
      <FiFolder className="mx-auto text-gray-400" size={48} />
      <p className="mt-3 text-gray-500">No files found in this directory</p>
      <p className="text-sm text-gray-400 mt-1">Upload or create files to get started</p>
    </div>
  )
}

export default FileExplore
