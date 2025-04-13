import { useForm } from '@inertiajs/react'
import { ChangeEvent, FormEvent } from 'react'
import { FiX, FiUser, FiRefreshCw } from 'react-icons/fi'
import Role from '#models/role'
import { toast } from 'react-toastify'

const AddUserModal = ({
  setOpen,
  roles,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  roles: Role[]
}) => {
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/:;.,<>?'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result.trim()
  }

  const { processing, post, data, setData, reset } = useForm({
    username: '',
    role: roles[0].role,
    code: generateRandomCode(),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    post('/user', {
      onSuccess: () => {
        toast.success('User created')
        setOpen(false)
      },
      onError: (err) => {
        toast.error(typeof err === 'string' ? err : 'An error as occurred')
      },
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiUser className="mr-2" /> Add New User
          </h3>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="name"
                value={data.username}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="johndoe"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={data.role}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.level}>
                  {role.role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={data.code}
                  onChange={handleChange}
                  className={`block w-full h-full rounded-md border p-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  readOnly={true}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setData((prev) => ({ ...prev, code: generateRandomCode() }))
                  }}
                  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FiRefreshCw className="mr-1" /> Generate
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className={`px-4 py-2 rounded-md text-white ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} flex items-center`}
            >
              {processing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
