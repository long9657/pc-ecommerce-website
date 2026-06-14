import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../api/category.api'

interface Category {
  _id: string
  name: string
  image: string
  created_at?: string
  updated_at?: string
}

export default function CategoriesAdmin() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', image: '' })
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Query
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data.result)
  })

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data: { name: string; image: string }) => {
      if (editCategory) {
        return updateCategory(editCategory._id, data)
      }
      return createCategory(data)
    },
    onSuccess: () => {
      toast.success(editCategory ? 'Category updated successfully!' : 'Category created successfully!')
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => toast.error('An error occurred. Please try again.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted successfully!')
      setDeleteConfirmId(null)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => toast.error('Error deleting category!')
  })

  // Handlers
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditCategory(category)
      setFormData({ name: category.name, image: category.image })
    } else {
      setEditCategory(null)
      setFormData({ name: '', image: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error('Category name is required!')
    if (!formData.image.trim()) return toast.error('Category image URL is required!')
    saveMutation.mutate(formData)
  }

  if (isLoading)
    return (
      <div className='flex justify-center items-center mt-32'>
        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
      </div>
    )

  return (
    <div className='max-w-5xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl font-semibold text-dark'>Categories Management</h1>
          <p className='text-sm text-gray-500 mt-1'>
            {categories?.length || 0} categories total
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className='bg-primary text-white px-5 py-2.5 font-semibold hover:bg-primary/90 transition rounded-md shadow-sm flex items-center gap-2'
        >
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Add Category
        </button>
      </div>

      {/* Category Grid */}
      <div className='bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-gray-200 bg-gray-50'>
          <h2 className='text-lg font-semibold text-dark'>All Categories</h2>
        </div>

        {categories && categories.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200'>
                  <th className='p-4 pl-6 w-20'>Image</th>
                  <th className='p-4'>Category Name</th>
                  <th className='p-4'>Image URL</th>
                  <th className='p-4 pr-6 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 text-sm'>
                {categories.map((cat) => (
                  <tr key={cat._id} className='hover:bg-gray-50 transition-colors group'>
                    <td className='p-4 pl-6'>
                      <div className='w-14 h-14 border border-gray-200 rounded-md overflow-hidden bg-white flex items-center justify-center shadow-sm'>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className='w-full h-full object-contain p-1'
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/56x56?text=?'
                          }}
                        />
                      </div>
                    </td>
                    <td className='p-4'>
                      <span className='font-semibold text-dark'>{cat.name}</span>
                    </td>
                    <td className='p-4 max-w-xs'>
                      <span className='text-gray-400 text-xs truncate block max-w-[200px]' title={cat.image}>
                        {cat.image}
                      </span>
                    </td>
                    <td className='p-4 pr-6 text-right'>
                      <div className='flex items-center justify-end gap-3'>
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className='text-primary hover:underline font-semibold text-sm transition'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat._id)}
                          className='text-red-600 hover:underline font-semibold text-sm transition'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
            <svg className='w-16 h-16 mb-4 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
            </svg>
            <p className='text-lg font-semibold text-gray-400'>No categories found</p>
            <p className='text-sm text-gray-400 mt-1'>Click "Add Category" to create one</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-md w-full max-w-lg shadow-2xl'>
            {/* Modal Header */}
            <div className='p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center'>
              <h2 className='text-xl font-bold text-dark'>
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-dark text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition'
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              {/* Category Name */}
              <div>
                <label className='block text-sm font-semibold text-dark mb-1'>
                  Category Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='e.g. CPU, GPU, RAM...'
                  className='w-full border border-gray-300 px-4 py-2.5 rounded-md focus:border-primary outline-none transition text-sm'
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className='block text-sm font-semibold text-dark mb-1'>
                  Image URL <span className='text-red-500'>*</span>
                </label>
                <input
                  type='url'
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder='https://example.com/image.png'
                  className='w-full border border-gray-300 px-4 py-2.5 rounded-md focus:border-primary outline-none transition text-sm'
                  required
                />
                {/* Image Preview */}
                {formData.image && (
                  <div className='mt-3 flex items-center gap-3'>
                    <div className='w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm'>
                      <img
                        src={formData.image}
                        alt='Preview'
                        className='w-full h-full object-contain p-1'
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                    <span className='text-xs text-gray-400'>Image Preview</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='flex justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-6 py-2.5 border border-gray-300 font-semibold text-dark rounded-md bg-white hover:bg-gray-50 transition text-sm'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={saveMutation.isPending}
                  className='px-6 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50 text-sm'
                >
                  {saveMutation.isPending ? 'Saving...' : editCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-md w-full max-w-sm shadow-2xl p-6'>
            <div className='flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4'>
              <svg className='w-6 h-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            </div>
            <h3 className='text-lg font-bold text-dark text-center mb-2'>Delete Category</h3>
            <p className='text-sm text-gray-500 text-center mb-6'>
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className='flex-1 px-4 py-2.5 border border-gray-300 font-semibold text-dark rounded-md bg-white hover:bg-gray-50 transition text-sm'
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isLoading}
                className='flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition text-sm disabled:opacity-50'
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
