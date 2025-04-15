import User from '#models/user'
import AddRole from '@components/add_role'
import { router, useForm } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'

const Role = ({
  roles,
  user,
}: {
  roles: { id: number; role: string; level: number }[]
  user: User
}) => {
  const levelRoleuser = roles.find((role) => role.role === user.role)?.level || 0
  const [edit, setEdit] = useState<number | null>(null)
  const { data, setData, put } = useForm<{ id: number; role: string; level: number }>()

  const getHigheRole = (forMin: boolean) => {
    const otherRoles = forMin ? roles.filter((role) => role.role !== user.role) : roles
    const higherRoles = Math.max(...otherRoles.map((o) => o.level))
    return higherRoles
  }

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

  const editRole = (id: number, role: string, level: number) => {
    setEdit(id)
    setData({
      id,
      role,
      level,
    })
  }

  const saveRole = (e: FormEvent) => {
    e.preventDefault()
    put('/role', {
      onSuccess: () => {
        toast.success('Role updated!')
        setEdit(null)
      },
      onError: (e) => {
        toast.error(typeof e === 'string' ? e : 'An error occurred')
      },
    })
  }

  function isSameRoleAsUser() {
    return roles.filter((role) => role.role === user.role && role.id === edit).length > 0
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Manage Roles</h4>
        <AddRole />
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="grid gap-2 grid-cols-6 items-center p-3 bg-gray-50 rounded-md"
            >
              {edit === role.id ? (
                <form
                  onSubmit={(e) => saveRole(e)}
                  className="grid gap-2 col-span-7 grid-cols-6 items-center bg-gray-50"
                >
                  <input
                    className="col-span-2 font-medium bg-gray-50 border border-gray-300 rounded-md p-2"
                    type="text"
                    name="role"
                    id="role"
                    autoFocus
                    onChange={(e) => setData('role', e.target.value)}
                    value={data.role}
                  />
                  <input
                    className="col-span-2 text-center text-gray-500 bg-gray-50 border border-gray-300 rounded-md p-2"
                    type="number"
                    name="level"
                    id="level"
                    onChange={(e) => setData('level', Number(e.target.value))}
                    value={data.level}
                    /*    min={isSameRoleAsUser() ? getHigheRole(true) + 1 : 0}
                    max={isSameRoleAsUser() ? undefined : getHigheRole(false) - 1} */
                  />

                  <button
                    className="text-blue-600 hover:text-blue-800 flex justify-end col-end-8 w-[3em]"
                    title="Edit role"
                  >
                    <FiSave />
                  </button>
                </form>
              ) : (
                <>
                  <span className="col-span-2 font-medium">{role.role}</span>
                  <span className="col-span-2 text-center text-gray-500">{role.level}</span>
                </>
              )}
              <div className="flex justify-end col-end-8 w-[3em]">
                {edit === role.id ? null : (
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Delete role"
                    type="submit"
                    onClick={() => editRole(role.id, role.role, role.level)}
                  >
                    <FiEdit />
                  </button>
                )}
                {edit !== role.id && levelRoleuser > role.level && role.role !== user.role ? (
                  <button
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete role"
                    onClick={() => deleteRole(role.id)}
                  >
                    <FiTrash2 />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Role
