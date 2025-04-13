import User from '#models/user'
import { FiSearch, FiUser } from 'react-icons/fi'
import Layout from './layout'
import { ReactNode } from 'react'
import { Link } from '@inertiajs/react'

const Dashboard = ({ user }: { user: User }) => {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">File Manager</h1>
        <p className="text-gray-600">Access and manage your files and folders</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-8">
        {/* Search bar */}
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

        {/* User profile */}
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

      <section></section>
    </main>
  )
}

Dashboard.layout = (page: ReactNode) => <Layout children={page} />

export default Dashboard
