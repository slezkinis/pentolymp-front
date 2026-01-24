import React from 'react'
import { Header, UserMenu } from './index'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header>
        <a href="/"><h1 className="text-2xl font-bold text-gray-900">ПентОлимп</h1></a>
        <UserMenu />
      </Header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout