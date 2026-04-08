'use client'

import Login from '../components/Login'
import Register from '../components/Register'
import Dashboard from '../components/Dashboard'
import CustomerDashboard from '../components/CustomerDashboard'
import { useState } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login')

  return (
    <>
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <Register onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'customer' && <CustomerDashboard onNavigate={setCurrentPage} />}
    </>
  )
}
