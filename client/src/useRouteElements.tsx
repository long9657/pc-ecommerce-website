import { useRoutes } from 'react-router'
import ProductList from './pages/ProductList/'
import Products from './pages/Products'
import Login from './pages/Login/'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import MainLayout from './layouts/MainLayout'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import ProfileDashboard from './pages/Profile/ProfileDashboard'
import AccountInformation from './pages/Profile/AccountInformation'
import Bills from './pages/Bills'
import Checkout from './pages/Checkout/Checkout'
import ProductDetail from './pages/ProductDetail'
import Orders from './pages/Orders/Orders'
import ProfileLayout from './layouts/ProfileLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import OrdersAdmin from './pages/Admin/Orders/OrdersAdmin'
import ProductsAdmin from './pages/Admin/Products/ProductsAdmin'
import UsersAdmin from './pages/Admin/Users/UsersAdmin'
import About from './pages/About/About'
import StaticInfo from './pages/StaticInfo/StaticInfo'

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
      path: '/forgot-password',
      element: (
        <MainLayout>
          <ForgotPassword />
        </MainLayout>
      )
    },
    {
      path: '/reset-password',
      element: (
        <MainLayout>
          <ResetPassword />
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
      path: '/about',
      element: (
        <MainLayout>
          <About />
        </MainLayout>
      )
    },
    {
      path: '/about-zip',
      element: (
        <MainLayout>
          <StaticInfo 
            title='About Zip' 
            content={
              <>
                <p>Zip allows you to split your purchases into 4 interest-free installments, over 6 weeks. Simply select Zip at checkout, and get approved instantly.</p>
                <h3 className='text-lg font-bold mt-6 mb-2'>How it works</h3>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>Add items to your cart and proceed to checkout.</li>
                  <li>Choose Zip as your payment method.</li>
                  <li>Create your account and complete your purchase.</li>
                  <li>Pay 25% today, and the rest over 3 installments.</li>
                </ul>
              </>
            } 
          />
        </MainLayout>
      )
    },
    {
      path: '/privacy',
      element: (
        <MainLayout>
          <StaticInfo 
            title='Privacy Policy' 
            content={
              <>
                <p>Your privacy is critically important to us. At Tecs, we have a few fundamental principles:</p>
                <ul className='list-disc pl-5 space-y-2 mt-4'>
                  <li>We don’t ask you for personal information unless we truly need it.</li>
                  <li>We don’t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
                  <li>We don’t store personal information on our servers unless required for the on-going operation of one of our services.</li>
                </ul>
              </>
            } 
          />
        </MainLayout>
      )
    },
    {
      path: '/profile',
      element: (
        <MainLayout>
          <ProfileLayout />
        </MainLayout>
      ),
      children: [
        {
          index: true,
          element: <ProfileDashboard />
        },
        {
          path: 'edit',
          element: <AccountInformation />
        },
        {
          path: 'orders',
          element: <Orders />
        },
        {
          path: 'address-book',
          element: <ProfileDashboard />
        },
        {
          path: 'downloads',
          element: <ProfileDashboard />
        },
        {
          path: 'payments',
          element: <ProfileDashboard />
        },
        {
          path: 'billing-agreements',
          element: <ProfileDashboard />
        },
        {
          path: 'wishlist',
          element: <ProfileDashboard />
        },
        {
          path: 'reviews',
          element: <ProfileDashboard />
        },
        {
          path: 'newsletter',
          element: <ProfileDashboard />
        }
      ]
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
