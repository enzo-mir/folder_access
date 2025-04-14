import User from '#models/user'
import { FiSearch, FiUser, FiChevronRight, FiHome, FiPlus, FiUpload } from 'react-icons/fi'
import Layout from './layout'
import { ReactNode, useState } from 'react'
import { Link } from '@inertiajs/react'
import { FilesType } from '../../app/types/files.type'
import FileExplore from '@components/file_explore'
import EditFile from '@components/edit_file'

const Dashboard = ({
  user,
  files,
  currentPath,
  content,
}: {
  currentPath: string
  user: User
  files?: FilesType
  content?: string
}) => {
  const [newPath, setNewPath] = useState<'file' | 'folder' | null>(null)

  const pathParts = currentPath.split('/').filter((part) => part !== '')
  const breadcrumbs = pathParts.map((part, index) => {
    const path = '/dashboard/' + pathParts.slice(0, index + 1).join('/')
    return {
      name: part,
      path: path,
    }
  })

  return (
    <main className="h-[100%] bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">File Manager</h1>
        <p className="text-gray-600">Access and manage your files and folders</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-8">
        <div className="lg:col-span-5 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search files and folders..."
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="bg-white lg:col-span-2 rounded-lg shadow-sm p-4 flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FiUser className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.username}</p>
            <p className="text-sm text-gray-500">role : {user.role}</p>
          </div>
        </div>
        <Link
          href={'/users'}
          className="bg-indigo-700 hover:pointer text-white rounded-lg shadow-sm p-4 flex items-center"
        >
          <div>
            <p className="font-medium">All users</p>
          </div>
        </Link>
      </section>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 bg-white rounded-lg shadow-sm p-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
                <FiHome className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index}>
                <div className="flex items-center">
                  <FiChevronRight
                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link
                    href={crumb.path}
                    className={`ml-2 text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex gap-2">
          {files ? (
            <>
              <button
                onClick={() => setNewPath('file')}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiUpload className="mr-2" />
                <span>Add File</span>
              </button>
              <button
                onClick={() => setNewPath('folder')}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                <span>Add Folder</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      {files ? (
        <FileExplore
          setNewPath={setNewPath}
          newPath={newPath}
          currentPath={currentPath}
          files={files}
        />
      ) : content !== undefined ? (
        <EditFile content={content} />
      ) : null}
    </main>
  )
}

Dashboard.layout = (page: ReactNode) => <Layout children={page} />

export default Dashboard
