import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <main>
        <Navbar />
        <Outlet />
    </main>
  )
}

export default Layout
