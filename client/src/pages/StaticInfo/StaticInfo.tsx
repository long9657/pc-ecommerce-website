import React from 'react'

export default function StaticInfo({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div className='bg-white text-dark min-h-[60vh] py-16 px-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>{title}</h1>
        <div className='prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed'>
          {content}
        </div>
      </div>
    </div>
  )
}
