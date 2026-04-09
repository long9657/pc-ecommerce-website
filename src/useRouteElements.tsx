import { useRoutes } from 'react-router'
import ProductList from './pages/ProductList/'
import Login from './pages/Login/'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Contact from './pages/Contact'
import Faq from './pages/Faq'

function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <ProductList></ProductList>
        </MainLayout>
      )
    },
    {
      path: '/login',
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: '/register',
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    },
    {
      path: '/contact',
      element: (
        <MainLayout>
          <Contact />
        </MainLayout>
      )
    },
    {
      path: '/faq',
      element: (
        <MainLayout>
          <Faq   />
        </MainLayout>
      )
    }
  ])
  return routeElements
}

export default useRouteElements
