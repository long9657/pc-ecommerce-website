import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import http from '../../../utils/http'
import { toast } from 'react-toastify'

export default function UsersAdmin() {
  const queryClient = useQueryClient()

  // Lấy danh sách users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => http.get('/users/admin').then((r) => r.data.result)
  })

  // Xóa user
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => http.delete(`/users/admin/${id}`),
    onSuccess: () => {
      toast.success('Xóa người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Có lỗi xảy ra khi xóa người dùng!')
  })

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" không? Toàn bộ dữ liệu của họ có thể bị ảnh hưởng.`)) {
      deleteUserMutation.mutate(id)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN')

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )

  if (error)
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-slate-800 gap-4'>
        <p className='text-xl font-semibold'>⛔ Không thể tải dữ liệu người dùng!</p>
      </div>
    )

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý Khách hàng</h1>
        <div className='bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm'>
          Tổng số: {users?.length || 0} người
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
          <h2 className='text-lg font-bold text-slate-700'>Danh sách Người dùng</h2>
          <input 
            type='text' 
            placeholder='Tìm kiếm người dùng...' 
            className='bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-72 transition-all'
          />
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200'>
                <th className='p-4 pl-6'>Avatar</th>
                <th className='p-4'>Thông tin</th>
                <th className='p-4'>Vai trò</th>
                <th className='p-4'>Ngày tạo</th>
                <th className='p-4 pr-6 text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-sm'>
              {users?.map((user: any) => (
                <tr key={user._id} className='hover:bg-slate-50 transition-colors'>
                  <td className='p-4 pl-6'>
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`} 
                      alt={user.name || user.email}
                      className='w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm'
                    />
                  </td>
                  <td className='p-4'>
                    <div className='font-bold text-slate-800 mb-0.5'>{user.name || 'Chưa cập nhật'}</div>
                    <div className='text-slate-500 text-xs'>{user.email}</div>
                  </td>
                  <td className='p-4'>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${user.roles?.includes(1) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.roles?.includes(1) ? 'Admin' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className='p-4 text-slate-500 font-medium'>
                    {formatDate(user.created_at)}
                  </td>
                  <td className='p-4 pr-6 text-right'>
                    <button 
                      onClick={() => handleDelete(user._id, user.name || user.email)}
                      disabled={deleteUserMutation.isLoading}
                      className='bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50'
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={5} className='p-12 text-center text-slate-500'>
                    Chưa có người dùng nào.
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
