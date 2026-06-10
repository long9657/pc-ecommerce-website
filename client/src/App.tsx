import './App.css'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

function App() {
  const routes = useRouteElements()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  return (
    <div>
      {' '}
      {routes}
      <ToastContainer />
    </div>
  )
}

export default App
