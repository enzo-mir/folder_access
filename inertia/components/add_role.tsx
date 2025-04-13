import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'

const AddRole = () => {
  const { data, setData, post, reset, processing } = useForm({
    role: '',
    level: 0,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    post('/role', {
      onSuccess: () => {
        reset()
        toast.success('Role created !')
      },
      onError: (e) => {
        toast.error(typeof e === 'string' ? e : 'An error as occurred')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 mb-4">
      <label className="col-span-3 text-grey-500 w-[30%] justify-self-center" htmlFor="level">
        Access level
      </label>
      <input
        type="text"
        value={data.role}
        onChange={(e) => setData({ ...data, role: e.target.value })}
        placeholder="New role name"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        name="level"
        value={data.level}
        onChange={(e) => setData({ ...data, level: Number.parseInt(e.target.value) })}
        id="level"
        min={0}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        disabled={processing}
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
      >
        <FiPlus className="mr-1" /> Add Role
      </button>
    </form>
  )
}

export default AddRole
