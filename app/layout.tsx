"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase' // Ensure this is imported
import { useEffect, useState } from 'react' // For client-side auth state management

const inter = Inter({ subsets: ['latin'] })

// Mark layout as client-side component since it uses useEffect
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="text-2xl font-bold text-blue-600">
              S.Mahi Global
            </a>

            {/* Navigation Links */}
            <div className="space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </a>
              <a href="/services" className="text-gray-600 hover:text-blue-600">
                Services
              </a>
            </div>

            {/* Auth Actions */}
            <div>
              {isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <a href="/auth/signin" className="mr-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                      Sign In
                    </button>
                  </a>
                  <a href="/auth/signup">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Sign Up
                    </button>
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Toaster for Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}