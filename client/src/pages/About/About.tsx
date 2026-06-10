import React from 'react'
import { motion } from 'motion/react'

export default function About() {
  return (
    <div className='bg-white text-dark min-h-screen py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-16'
        >
          <h1 className='text-4xl md:text-5xl font-black italic uppercase mb-6'>About Us</h1>
          <div className='w-24 h-1 bg-primary mx-auto mb-8'></div>
          <p className='text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed'>
            We are passionate about PC gaming and high-performance computing. Founded with the goal of providing the best hardware to enthusiasts, gamers, and professionals, we have quickly grown to become a leading retailer of premium PC components and custom builds.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24'>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative aspect-video rounded-2xl overflow-hidden shadow-2xl'
          >
            <img 
              src='https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=800' 
              alt='Our Workspace' 
              className='w-full h-full object-cover'
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold mb-6'>Our Mission</h2>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              Our mission is to empower creators and gamers with the ultimate computing experience. We believe that everyone deserves a machine that perfectly matches their needs, whether it's for crushing the latest AAA titles, rendering 3D animations, or simply enjoying a blazing-fast everyday workflow.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              We partner with top-tier brands like MSI, Razer, ASUS, and Gigabyte to ensure our customers have access to the latest and most reliable technology on the market.
            </p>
          </motion.div>
        </div>

        <div className='bg-[#F5F7FF] rounded-3xl p-12 text-center mb-16'>
          <h2 className='text-3xl font-bold mb-12'>Why Choose Us?</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center'>
              <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>
              </div>
              <h3 className='text-xl font-bold mb-4'>Premium Quality</h3>
              <p className='text-gray-500 text-sm'>We only stock tested and verified components from reputable brands.</p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path></svg>
              </div>
              <h3 className='text-xl font-bold mb-4'>Fast Delivery</h3>
              <p className='text-gray-500 text-sm'>Express shipping options to get your gear exactly when you need it.</p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'></path></svg>
              </div>
              <h3 className='text-xl font-bold mb-4'>Expert Support</h3>
              <p className='text-gray-500 text-sm'>Our team of PC building experts is always ready to assist you.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
