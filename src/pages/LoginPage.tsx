import { Card, CardContent} from '../components/card';
import Login from '../components/Login'
import { TestTube2 } from 'lucide-react'

function LoginPage() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-6 space-y-6">

  {/* Header */}
  <div className="text-center">
    <div className="flex items-center justify-center mb-4">
      <TestTube2 className="h-12 w-12 text-blue-600 mr-3" />
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        TestMagic
      </h1>
    </div>
    <p className="text-lg text-gray-600">Advanced Test Case Management & Reporting System</p>
  </div>

  {/* Login Card */}
  <div className="rounded-3xl shadow-xl w-full max-w-2xl transition-all duration-500">
    <Login />
  </div>

  {/* Demo Credentials */}
  <Card className="bg-yellow-50 border-yellow-200 w-full max-w-2xl">
    <CardContent className="pt-6">
      <div className="text-center text-sm text-yellow-800">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p><strong>Admin:</strong> admin@testmagic.com / admin123</p></div>
          <div><p><strong>Tester:</strong> tester@testmagic.com / tester123</p></div>
        </div>
      </div>
    </CardContent>
  </Card>

</div>

  )
}

export default LoginPage
