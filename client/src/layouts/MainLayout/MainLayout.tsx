import type { ReactNode } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Footer2 from '../../components/Footer2'
import TopBar from '../../components/TopBar/TopBar'

interface Props {
  children: ReactNode
}
function MainLayout({ children }: Props) {
  return (
    <div>
      <TopBar />
      <Header></Header>
      <main>{children}</main>
      <Footer2/>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
