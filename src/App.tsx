import './App.css'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
function App() {
  const routes = useRouteElements()

  return (
    <div>
      {' '}
      {routes}
      <ToastContainer />
    </div>
  )
}

export default App
