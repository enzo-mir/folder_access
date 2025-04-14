import { FormEvent, useState } from 'react'
import { FiChevronDown, FiFolder, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'

const Permission = ({
  folderPermissions,
  roles,
}: {
  folderPermissions?: Record<string, string[]>
  roles: { id: number; role: string }[]
}) => {
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState(roles[0].role)

  const { data, setData, post } = useForm({
    path: '',
    permission: selectedRoleForPermission,
  })

  const handlAddFolderPermission = (e: FormEvent) => {
    e.preventDefault()
    post('/folder-permission', {
      onSuccess: () => {
        toast.success('Folder permission added successfully')
        setData({ ...data, path: '' })
      },
      onError: (e) => {
        toast.error(
          typeof e === 'string' ? e : 'An error occurred while adding the folder permission'
        )
      },
    })
  }

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
        <form onSubmit={handlAddFolderPermission} className="flex gap-2 mb-4">
          <input
            type="text"
            value={data.path}
            onChange={(e) => setData('path', e.target.value)}
            placeholder="Folder path (e.g. /projects)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </form>
      </div>

      <div>
        <h5 className="font-medium text-gray-800 mb-2">
          Current Permissions for {selectedRoleForPermission}
        </h5>
        {folderPermissions ? (
          folderPermissions[selectedRoleForPermission]?.length > 0 ? (
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
                  <button className="text-red-600 hover:text-red-800 p-1" title="Remove permission">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No folder permissions set for this role</p>
          )
        ) : (
          <p className="text-gray-500 italic">No folder permissions set for this role</p>
        )}
      </div>
    </section>
  )
}

export default Permission
