import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({children}) => {
  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <main>{children}</main>
    </div>
  )
}

export default Layout
