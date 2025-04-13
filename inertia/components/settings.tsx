import Role from '#models/role'
import User from '#models/user'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { FiX, FiFolder, FiUser, FiPlus, FiTrash2, FiSave, FiChevronDown } from 'react-icons/fi'
import AddRole from './add_role'
import { toast } from 'react-toastify'

const SettingsModal = ({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [activeTab, setActiveTab] = useState('roles')
  const { roles, user } = usePage().props as unknown as { roles: Role[]; user: User }

  const deleteRole = (id: number) => {
    router.delete('/role', {
      data: { id },
      onSuccess: () => {
        toast.success('Role deleted !')
      },

      onError: (e) => {
        toast.error(typeof e === 'string' ? e : 'An error as occurred')
      },
    })
  }

  const [folderPermissions, setFolderPermissions] = useState({
    Admin: ['/root', '/projects', '/confidential'],
    Editor: ['/projects', '/assets'],
    Viewer: ['/public'],
  })
  const [newPermission, setNewPermission] = useState('')
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState('Admin')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold text-gray-800">System Settings</h3>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Manage Roles</h4>
                <AddRole />
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <span className="font-medium">{role.role}</span>
                      <span>{role.level}</span>
                      {!role.role.includes(user.role) ? (
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600 hover:text-red-800 p-1 w-[3em] flex justify-end"
                          title="Delete role"
                        >
                          <FiTrash2 />
                        </button>
                      ) : (
                        <span className="w-[3em]"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Folder Permissions</h4>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <div className="relative">
                  <select
                    value={selectedRoleForPermission}
                    onChange={(e) => setSelectedRoleForPermission(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.role}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Folder Permission
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newPermission}
                    onChange={(e) => setNewPermission(e.target.value)}
                    placeholder="Folder path (e.g. /projects)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <FiPlus className="mr-1" /> Add
                  </button>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-2">
                  Current Permissions for {selectedRoleForPermission}
                </h5>
                {folderPermissions[selectedRoleForPermission]?.length > 0 ? (
                  <div className="space-y-2">
                    {folderPermissions[selectedRoleForPermission].map((permission) => (
                      <div
                        key={permission}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <FiFolder className="text-gray-500 mr-2" />
                          <span>{permission}</span>
                        </div>
                        <button
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove permission"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No folder permissions set for this role</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 border-t p-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <FiSave className="mr-1" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
