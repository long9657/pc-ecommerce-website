import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import http from '../../../utils/http'
import { toast } from 'react-toastify'

export default function UsersAdmin() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  // Lấy danh sách users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => http.get('/users/admin').then((r) => r.data.result)
  })

  // Xóa user
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/users/admin/${id}`),
    onSuccess: () => {
      toast.success('Deleted user successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Error deleting user!')
  })

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? All their data will be affected.`)) {
      deleteUserMutation.mutate(id)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US')

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    )

  if (error)
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-dark gap-4'>
        <p className='text-xl font-semibold'>⛔ Could not load user data!</p>
      </div>
    )

  const filteredUsers = users?.filter((user: any) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      (user.email && user.email.toLowerCase().includes(s)) ||
      (user.name && user.name.toLowerCase().includes(s))
    )
  })

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-xl font-semibold text-dark'>Users Management</h1>
        <div className='border border-primary text-primary px-4 py-2 font-semibold text-sm rounded-md'>
          Total: {users?.length || 0} users
        </div>
      </div>

      <div className='flex items-center gap-6 mb-6'>
        <div className='bg-white p-5 border border-gray-200 min-w-[200px] rounded-md shadow-sm'>
          <div className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2'>Total Users</div>
          <div className='text-2xl font-bold text-dark'>{users?.length || 0}</div>
        </div>

        <div className='flex-1 max-w-md relative'>
          <input 
            type='text' 
            placeholder='Search by email / name...' 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full border border-gray-300 px-4 py-2.5 focus:border-primary outline-none rounded-md shadow-sm'
          />
        </div>
      </div>

      <div className='bg-white border border-gray-200 overflow-hidden rounded-md'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-dark'>Users List</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200'>
                <th className='p-4 pl-6'>Avatar</th>
                <th className='p-4'>Information</th>
                <th className='p-4'>Role</th>
                <th className='p-4'>Joined Date</th>
                <th className='p-4 pr-6 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 text-sm'>
              {filteredUsers?.map((user: any) => (
                <tr key={user._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='p-4 pl-6'>
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`} 
                      alt={user.name || user.email}
                      className='w-10 h-10 object-cover border border-gray-200'
                    />
                  </td>
                  <td className='p-4'>
                    <div className='font-semibold text-dark mb-0.5'>{user.name || 'Not updated'}</div>
                    <div className='text-gray-500 text-xs'>{user.email}</div>
                  </td>
                  <td className='p-4'>
                    <span className={`px-2 py-0.5 text-xs font-semibold border ${user.roles?.includes(1) ? 'border-indigo-200 text-indigo-600' : 'border-gray-200 text-gray-600'}`}>
                      {user.roles?.includes(1) ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className='p-4 text-gray-500 font-medium'>
                    {formatDate(user.created_at)}
                  </td>
                  <td className='p-4 pr-6 text-right'>
                    <button 
                      onClick={() => handleDelete(user._id, user.name || user.email)}
                      disabled={deleteUserMutation.isLoading}
                      className='text-red-600 hover:underline font-semibold transition-colors disabled:opacity-50'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers?.length === 0 && (
                <tr>
                  <td colSpan={5} className='p-12 text-center text-gray-500'>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
