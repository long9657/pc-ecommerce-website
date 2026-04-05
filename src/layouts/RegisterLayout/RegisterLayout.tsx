import type { ReactNode } from 'react'
import Footer from '../../components/Footer'
import RegisterHeader from '../../components/RegisterHeader'

interface Props {
  children: ReactNode
}
function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      <div className='bg-red-50'>{children}</div>
      <Footer></Footer>
    </div>
  )
}

export default RegisterLayout
