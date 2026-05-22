import { useRoutes } from 'react-router'
import ProductList from './pages/ProductList/'
import Products from './pages/Products'
import Login from './pages/Login/'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Profile from './pages/Profile'
import Bills from './pages/Bills'
import ProductDetail from './pages/ProductDetail'

function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <ProductList/>
        </MainLayout>
      )
    },
    {
      path: '/products',
      element: (
        <MainLayout>
          <Products />
        </MainLayout>
      )
    },
    {
      path: '/product/:id',
      element: (
        <MainLayout>
          <ProductDetail/>
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
    },
    {
      path: '/profile',
      element: (
        <MainLayout>
          <Profile />
        </MainLayout>
      )
    },
    {
      path: '/bills',
      element: (
        <MainLayout>
          <Bills />
        </MainLayout>
      )
    }
  ])
  return routeElements
}

export default useRouteElements
