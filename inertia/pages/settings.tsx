import Role from '#models/role'
import User from '#models/user'
import RoleComponent from '@components/settings/role'
import { ReactNode, useState } from 'react'
import { FiFolder, FiUser } from 'react-icons/fi'
import Permission from '@components/settings/permission'
import Layout from './layout'

const Settings = ({
  folderPermission,
  roles,
  user,
}: {
  folderPermission: Record<string, string[]>
  roles: Role[]
  user: User
}) => {
  const [activeTab, setActiveTab] = useState('roles')

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
      </div>

      <div className="border-b mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FiUser className="inline mr-2" /> Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'permissions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FiFolder className="inline mr-2" /> Folder Permissions
          </button>
        </div>
      </div>

      <div className="bg-white p-6">
        {activeTab === 'roles' ? <RoleComponent roles={roles} user={user} /> : null}

        {activeTab === 'permissions' ? (
          <Permission folderPermissions={folderPermission} roles={roles} />
        ) : null}
      </div>
    </div>
  )
}

Settings.layout = (page: ReactNode) => {
  return <Layout children={page} />
}

export default Settings
