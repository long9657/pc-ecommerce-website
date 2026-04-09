function Footer2() {
  return (
    <>
      <div className=''>
        <section className='bg-slate-50 py-16 md:py-5 px-5 '>
          <div className='container mx-auto max-w-7xl'>
          
            <div className='flex flex-col md:flex-row items-start justify-center gap-12 md:gap-16'>
              {/* 1. Cột Product Support */}
              <div className='flex-1 flex flex-col items-center text-center p-5'>
               
                <div className='flex  h-15 w-15 items-center justify-center rounded-full bg-blue-600 text-white mb-6'>
                
                  <svg
                    className='h-10 w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 106 0M15 18a3 3 0 116 0M9 18h6'
                    />
                  </svg>
                </div>

               
                <h3 className='xl:text-xl text-xl md:text-2xl font-extrabold text-black mb-3 leading-tight'>
                  Product Support
                </h3>

              
                <p className='xl:text-xl text-sm md:text-base text-gray-500 max-w-sm leading-relaxed'>
                  Up to 3 years on-site warranty available for your peace of mind.
                </p>
              </div>

            
              <div className='flex-1 flex flex-col items-center text-center text-xs p-5'>
                <div className='flex h-15 w-15 items-center justify-center rounded-full bg-blue-600 text-white mb-6'>
                
                  <svg
                    className='h-10 w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>

                <h3 className='xl:text-xl text-sm md:text-2xl font-extrabold text-black mb-3 leading-tight'>
                  Personal Account
                </h3>

                <p className='xl:text-xl text-sm md:text-base text-gray-500 max-w-sm leading-relaxed'>
                  With big discounts, free delivery and a dedicated support specialist.
                </p>
              </div>

           
              <div className='flex-1 flex flex-col items-center text-center p-5'>
                <div className='flex h-15 w-15 items-center justify-center rounded-full bg-blue-600 text-white mb-6'>
                
                  <svg
                    className='h-10 w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                    />
                  </svg>
                </div>

                <p className='xl:text-xl text-xs md:text-2xl font-extrabold text-black mb-3 leading-tight'>
                  Amazing Savings
                </p>

                <p className='xl:text-xl text-xs md:text-base text-gray-500 max-w-sm leading-relaxed'>
                  Up to 70% off new Products, you can be sure of the best price.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default Footer2
