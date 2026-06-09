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
import Checkout from './pages/Checkout/Checkout'
import ProductDetail from './pages/ProductDetail'
import Orders from './pages/Orders/Orders'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import OrdersAdmin from './pages/Admin/Orders/OrdersAdmin'
import ProductsAdmin from './pages/Admin/Products/ProductsAdmin'
import UsersAdmin from './pages/Admin/Users/UsersAdmin'

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
      path: '/:categorySlug/:productSlug',
      element: (
        <MainLayout>
          <ProductDetail/>
        </MainLayout>
      )
    },
    {
      path: '/login',
      element: (
        <MainLayout>
          <Login />
        </MainLayout>
      )
    },
    {
      path: '/register',
      element: (
        <MainLayout>
          <Register />
        </MainLayout>
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
      path: '/profile/orders',
      element: (
        <MainLayout>
          <Orders />
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
    },
    {
      path: '/checkout',
      element: (
        <MainLayout>
          <Checkout />
        </MainLayout>
      )
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: 'orders',
          element: <OrdersAdmin />
        },
        {
          path: 'products',
          element: <ProductsAdmin />
        },
        {
          path: 'users',
          element: <UsersAdmin />
        }
      ]
    },
    {
      path: '/:categorySlug',
      element: (
        <MainLayout>
          <Products />
        </MainLayout>
      )
    }
  ])
  return routeElements
}

export default useRouteElements
