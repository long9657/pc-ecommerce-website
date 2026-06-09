import type { ReactNode } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Footer2 from '../../components/Footer2'
interface Props {
  children: ReactNode
}
function MainLayout({ children }: Props) {
  return (
    <div>
      <Header></Header>
      <div className='bg-red-50'>{children}</div>
      <></>
      <Footer2/>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
