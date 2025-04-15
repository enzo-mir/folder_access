import { FormEvent, useEffect, useState } from 'react'
import { FiChevronDown, FiFolder, FiPlus, FiTrash2 } from 'react-icons/fi'
import { router, useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import {
  FolderMessageSSE,
  FolderPermissionSSE,
  FolderPermissionType,
} from 'types/folder_permission'
import { useDebounce } from '../../hooks/use_debounc'
import { transmitFolder } from '@provider/transmit'

const FolderPermissionComponent = ({
  folderPermissions,
  roles,
}: {
  folderPermissions?: FolderPermissionType
  roles: { id: number; role: string }[]
}) => {

  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState(roles[0]?.role || '')
  const { data, setData, post } = useForm({
    path: '',
    permission: selectedRoleForPermission,
  })
  const debouncedPath = useDebounce(data.path, 500)
  const [availableFolders, setAvailableFolders] = useState<FolderPermissionSSE>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFolderDropdown, setShowFolderDropdown] = useState(false)

  useEffect(() => {
    const subscription = transmitFolder()
    subscription.then((transmitMessage) => {
      transmitMessage.onMessage(({ folders }: FolderMessageSSE) => {
        setAvailableFolders(folders)
        setIsSearching(false)
      })
    })
  }, [])

  useEffect(() => {
    if (debouncedPath.length >= 2) {
      setIsSearching(true)
      router.post(
        '/folder',
        { path: debouncedPath },
        {
          preserveState: true,
          onError: () => setIsSearching(false),
        }
      )
    } else {
      setAvailableFolders([])
    }
  }, [debouncedPath])

  const handleAddFolderPermission = (e: FormEvent) => {
    e.preventDefault()
    if (!data.path) {
      toast.error('Please select a folder first')
      return
    }

    post('/folder-permissions', {
      onSuccess: () => {
        toast.success('Folder permission added successfully')
        setData('path', '')
        setAvailableFolders([])
      },
      onError: (errors) => {
        toast.error(
          typeof errors === 'string'
            ? errors
            : 'An error occurred while adding the folder permission'
        )
      },
    })
  }

  const handleRemoveFolderPermission = (id: number) => {
    if (!confirm('Are you sure you want to remove this permission?')) return

    router.delete('/folder-permissions', {
      data: { id },
      onSuccess: () => toast.success('Permission removed successfully'),
      onError: () => toast.error('Failed to remove permission'),
    })
  }

  const handleFolderSelect = (folderPath: string) => {
    setData('path', folderPath)
    setShowFolderDropdown(false)
  }

  const currentPermissions = folderPermissions?.[selectedRoleForPermission] || []

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Folder Permissions Management</h2>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Role to Manage
        </label>
        <div className="relative">
          <select
            value={selectedRoleForPermission}
            onChange={(e) => {
              setSelectedRoleForPermission(e.target.value)
              setData('permission', e.target.value)
            }}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:cursor-pointer appearance-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.role}>
                {role.role}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="mb-8">
        <form onSubmit={handleAddFolderPermission} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and Select Folder
            </label>
            <div className="relative">
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <input
                    type="text"
                    value={data.path}
                    onChange={(e) => setData('path', e.target.value)}
                    onFocus={() => setShowFolderDropdown(true)}
                    placeholder="Start typing to search folders..."
                    className="block w-full rounded-none rounded-l-md pl-4 pr-10 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="animate-spin h-5 w-5 text-gray-400 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="-ml-px relative inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" /> Add Permission
                </button>
              </div>

              {showFolderDropdown && availableFolders.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
                  {availableFolders.map((folder) => (
                    <li
                      tabIndex={0}
                      key={folder.path}
                      className="cursor-pointer hover:bg-blue-50 px-4 py-2 flex items-center"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleFolderSelect(folder.path)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleFolderSelect(folder.path)
                        }
                      }}
                      onClick={() => handleFolderSelect(folder.path)}
                    >
                      <FiFolder className="text-gray-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{folder.path}</span>
                      <span className="ml-auto text-xs text-gray-500">{folder.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enter at least 2 characters to search folders
            </p>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Permissions for {selectedRoleForPermission}
        </h3>

        {currentPermissions.length > 0 ? (
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {currentPermissions.map((permission) => (
                <li key={permission.id} className="px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center min-w-0">
                    <FiFolder className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="truncate">{permission.path}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFolderPermission(permission.id)}
                    className="ml-4 p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                    title="Remove permission"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No permissions set</h4>
            <p className="mt-1 text-sm text-gray-500">
              Add permissions by searching and selecting folders above
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FolderPermissionComponent
