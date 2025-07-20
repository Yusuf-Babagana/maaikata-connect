import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Shield, 
  Globe, 
  Star, 
  Users, 
  CheckCircle,
  ArrowRight,
  PlayCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MC</span>
              </div>
              <span className="font-bold text-xl">Ma'aikata Connect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with Verified Professionals
              <span className="block text-blue-600">Worldwide.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ma'aikata Connect is the global platform that bridges job seekers and employers 
              with verified professionals, ensuring accountability and trust through our 
              international agent network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/signup">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Provider
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/auth/signup">
                  <Search className="mr-2 h-5 w-5" />
                  Find Services
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">15K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ma'aikata Connect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides unmatched security, verification, and support for both 
              service providers and clients worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Verified Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All service providers undergo thorough verification including ID checks, 
                  skill assessments, and background verification by our international agents.
                </p>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ID Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with professionals across continents. Our platform supports 
                  international collaboration with local agent oversight for accountability.
                </p>
                <div className="mt-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Globe className="w-3 h-3 mr-1" />
                    12 Countries
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Agent Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our international agents provide local support, handle disputes, 
                  and ensure compliance with regional laws and regulations.
                </p>
                <div className="mt-4">
                  <Badge className="bg-purple-100 text-purple-800">
                    <Users className="w-3 h-3 mr-1" />
                    45 Active Agents
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to connect with the right professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Employers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">For Employers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Account & Subscribe</h4>
                    <p className="text-gray-600">
                      Sign up and subscribe to access our verified professional network
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Post Your Job</h4>
                    <p className="text-gray-600">
                      Describe your project requirements and set your budget
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Choose & Connect</h4>
                    <p className="text-gray-600">
                      Review applications and connect with verified professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Service Providers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">For Service Providers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Sign Up & Get Verified</h4>
                    <p className="text-gray-600">
                      Complete your profile and submit verification documents
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Browse & Apply</h4>
                    <p className="text-gray-600">
                      Find jobs matching your skills and submit proposals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Work & Earn</h4>
                    <p className="text-gray-600">
                      Complete projects and build your professional reputation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and businesses already using Ma'aikata Connect 
            to build successful working relationships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/auth/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/demo">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MC</span>
                </div>
                <span className="font-bold text-xl">Ma'aikata Connect</span>
              </div>
              <p className="text-gray-400">
                Connecting verified professionals worldwide with accountability and trust.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/verification" className="hover:text-white">Verification</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
                <li><Link href="/agents" className="hover:text-white">Agent Network</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link href="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ma'aikata Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}