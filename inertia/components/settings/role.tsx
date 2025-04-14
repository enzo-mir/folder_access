import AddRole from '@components/add_role'
import { router } from '@inertiajs/react'
import { FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'

const Role = ({
  roles,
  user,
}: {
  roles: { id: number; role: string; level: number }[]
  user: { role: string }
}) => {
  const deleteRole = (id: number) => {
    router.delete('/role', {
      data: { id },
      onSuccess: () => {
        toast.success('Role deleted!')
      },
      onError: (e) => {
        toast.error(typeof e === 'string' ? e : 'An error occurred')
      },
    })
  }
  return (
    <section>
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Manage Roles</h4>
        <AddRole />
        <div className="space-y-2">
          {roles.map((role) => (
            <div key={role.id} className="grid grid-cols-6 items-center p-3 bg-gray-50 rounded-md">
              <span className="col-span-2 font-medium w-fit max-w-[40%]">{role.role}</span>
              <span className="col-span-2 text-center text-gray-500">{role.level}</span>
              {!role.role.includes(user.role) ? (
                <button
                  className="text-red-600 hover:text-red-800 p-1 w-[3em] flex justify-end col-end-8"
                  title="Delete role"
                  onClick={() => deleteRole(role.id)}
                >
                  <FiTrash2 />
                </button>
              ) : (
                <span className="w-[3em] col-end-8"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Role
