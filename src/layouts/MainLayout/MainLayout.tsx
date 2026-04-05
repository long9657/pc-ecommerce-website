import type { ReactNode } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
interface Props {
  children: ReactNode
}
function MainLayout({ children }: Props) {
  return (
    <div>
      <Header></Header>
      <div className='bg-red-50'>{children}</div>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
