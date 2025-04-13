import Footer from '@components/footer'
import Header from '@components/header'
import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ToastContainer hideProgressBar={true} autoClose={2000} stacked={false} />
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Layout
