import anh1 from './image/anh1.png'
import anh2 from './image/anh2.png'
import anh3 from './image/anh3.png'
import anh4 from './image/anh4.png'
import anh5 from './image/anh5.png'

const About = () => {
  return (
    <div className='min-h-screen bg-white font-sans'>
      {/* 1. Breadcrumb & Title Section */}
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <nav className='text-xs text-gray-500 mb-4 flex gap-1'>
          <span className='hover:underline cursor-pointer'>Home</span>
          <span>›</span>
          <span className='font-medium text-black'>About Us</span>
        </nav>
        <h1 className='text-4xl font-bold text-black mb-8'>About Us</h1>
      </div>

      {/* 2. Main Content Section (Black Background) */}

      <div className='bg-black text-white p-16 md:px-50 md:py-30'>
        <div className='max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12'>
          {/* Left Side: Text Content */}

          <div className='lg:w-1/2 space-y-8'>
            <h2 className='text-4xl md:text-4xl font-bold leading-tight tracking-tight'>
              A Family That Keeps <br /> On Growing
            </h2>

            <div className='space-y-6 text-gray-300 text-lg leading-relaxed max-w-xl'>
              <p>
                We always aim to please the home market, supplying great computers and hardware at great prices to
                non-corporate customers, through our large Melbourne CBD showroom and our online store.
              </p>
              <p>
                Shop management approach fosters a strong customer service focus in our staff. We prefer to cultivate
                long-term client relationships rather than achieve quick sales, demonstrated in the measure of our
                long-term success.
              </p>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className='lg:w-1/2 w-full '>
            <div className='relative group w-4/5 h-full'>
              <img
                src={anh1} // Thay link ảnh showroom của bạn vào đây
                alt='Our Showroom'
                className='w-auto h-110 object-cover shadow-2xl rounded-sm '
              />
              {/* Optional: Overlay hiệu ứng nếu muốn */}
              <div className='absolute inset-0 border border-white/10 pointer-events-none'></div>
            </div>
          </div>
        </div>
      </div>

      <section className='max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16 bg-white'>
        {/* Hình ảnh sản phẩm (Alienware) */}
        <div className='w-full md:w-1/2 flex justify-center order-2 md:order-1'>
          <img
            src={anh2} // Thay bằng path ảnh bàn phím của bạn
            alt='Alienware Keyboard'
            className='w-full max-w-lg h-auto object-contain '
          />
        </div>

        {/* Nội dung text */}
        <div className='w-full md:w-1/2 space-y-8 order-1 md:order-2'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-600 p-3 rounded-xl shadow-lg'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <h2 className='text-4xl font-bold tracking-tight text-slate-900'>Shop.com</h2>
          </div>

          <div className='space-y-6 text-gray-700'>
            <p className='leading-relaxed text-xl font-semibold text-black'>
              Shop.com is a proudly Australian owned, Melbourne based supplier of I.T. goods and services, operating
              since 1991.
            </p>

            <p className='leading-relaxed text-lg text-gray-500'>
              Our client base encompasses individuals, small business, corporate and government organisations. We
              provide complete business IT solutions, centred on high quality hardware and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      <section className='bg-black text-white py-16 md:py-24 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-25 flex flex-col md:flex-row items-center gap-12'>
          {/* Cột bên trái: Nội dung văn bản */}
          <div className='w-full md:w-1/2 space-y-6 text-left'>
            {/* Icon trái tim màu xanh */}
            <div className='inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5 text-white'
              >
                <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.63 0 3.11.77 4.066 1.985a4.474 4.474 0 013.934-1.985c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
              </svg>
            </div>

            {/* Tiêu đề */}
            <h2 className='text-3xl md:text-4xl font-bold leading-tight max-w-md'>Now You're In Safe Hands</h2>

            {/* Nội dung mô tả */}
            <div className='space-y-4 max-w-lg'>
              <p className='text-gray-400 text-sm md:text-base leading-relaxed'>
                Experience a 40% boost in computing from last generation. MSI Desktop equips the 10th Gen. Intel® Core™
                i7 processor with the upmost computing power to bring you an unparalleled gaming experience.
              </p>

              <p className='text-gray-500 text-xs italic'>*Performance compared to i7-9700. Specs varies by model.</p>
            </div>
          </div>

          {/* Cột bên phải: Hình ảnh bộ PC */}
          <div className='w-full md:w-1/2 flex justify-center'>
            <div className='relative group'>
              {/* Ảnh PC */}
              <img
                src={anh3}
                alt='Gaming PC Desktop'
                className='w-full max-w-md h-auto object-contain  transform transition duration-500 group-hover:scale-105'
              />

              {/* Hiệu ứng phát sáng nhẹ đằng sau (tùy chọn) */}
              <div className='absolute -inset-4 bg-lime-400/10 blur-3xl -z-10 rounded-full opacity-50'></div>
            </div>
          </div>
        </div>
      </section>

      <section className='max-w-7xl mx-auto px-6 py-20 bg-white flex flex-col md:flex-row items-center gap-16 font-sans'>
        {/* 1. Cột bên trái: Hình ảnh PC trắng (NZXT Case) */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <div className='relative group'>
            <img
              src={anh4}
              alt='High Quality Gaming PC'
              className='w-full max-w-md h-auto object-contain  transition-transform duration-500 group-hover:scale-105'
            />
          </div>
        </div>

        {/* 2. Cột bên phải: Nội dung văn bản */}
        <div className='w-full md:w-1/2 space-y-6'>
          {/* Khu vực Tiêu đề kèm Icon */}
          <div className='flex items-center gap-4'>
            {/* Icon Ngôi sao màu xanh */}
            <div className='bg-blue-600 p-2.5 rounded-full shadow-lg shadow-blue-200'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 text-white'
              >
                <path
                  fillRule='evenodd'
                  d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                  clipRule='evenodd'
                />
              </svg>
            </div>

            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 leading-tight'>
              The Highest Quality <br /> of Products
            </h2>
          </div>

          {/* Đoạn mô tả */}
          <div className='space-y-4 max-w-xl'>
            <p className='text-gray-600 text-[16px] leading-relaxed'>
              We guarantee the highest quality of the products we sell. Several decades of successful operation and
              millions of happy customers let us feel certain about that. Besides, all items we sell pass thorough
              quality control, so no characteristics mismatch can escape the eye of our professionals.
            </p>
          </div>
        </div>
      </section>

      <section className='bg-black text-white py-16 md:py-24'>
        <div className='max-w-7xl mx-auto px-25 flex flex-col md:flex-row items-center gap-12 lg:gap-20'>
          {/* Cột bên trái: Nội dung văn bản */}
          <div className='w-full md:w-1/2 space-y-6 order-2 md:order-1'>
            {/* Icon Xe tải màu xanh */}
            <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 text-white'
              >
                <path d='M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z' />
                <path d='M15 15h4.5a3 3 0 116 0h.75a.75.75 0 00.75-.75V12h-3V6c0-1.035-.84-1.875-1.875-1.875h-3.375v10.875zM21 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
            </div>

            {/* Tiêu đề */}
            <h2 className='text-3xl md:text-4xl font-bold leading-tight max-w-sm'>We Deliver to Any Regions</h2>

            {/* Nội dung mô tả */}
            <div className='max-w-lg'>
              <p className='text-gray-400 text-sm md:text-base leading-relaxed'>
                We deliver our goods all across Australia. No matter where you live, your order will be shipped in time
                and delivered right to your door or to any other location you have stated. The packages are handled with
                utmost care, so the ordered products will be handed to you safe and sound, just like you expect them to
                be.
              </p>
            </div>
          </div>

          {/* Cột bên phải: Hình ảnh bộ PC trắng đen */}
          <div className='w-full md:w-1/2 flex justify-center order-1 md:order-2'>
            <div className='relative group'>
              <img
                src={anh5}
                alt='Premium Gaming PC Case'
                className='w-full max-w-md h-auto object-contain '
              />

              {/* Hiệu ứng ánh sáng xanh dương nhẹ phía sau PC (Glow) */}
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-900/20 blur-[120px] -z-10 rounded-full'></div>
            </div>
          </div>
        </div>
      </section>

      <div>
        
      </div>
    </div>
  )
}

export default About
