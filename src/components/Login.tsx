import { useState } from "react"
import { users } from "../utils/mockData"
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Shield, User, Mail, Lock } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('admin')
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({});

  function validate() {
    const errs: { email?: string, password?: string } = {};
    if (!enteredEmail) errs.email = "Email is required.";
    if (!enteredPassword) errs.password = "Password is required.";
    return errs;
  }

  function signIn() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role first.");
      return;
    }

    const user = users.find(user =>
      user.role === selectedRole &&
      user.email === enteredEmail &&
      user.password === enteredPassword
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify({
        email: user.email,
        role: user.role
      }))

      localStorage.setItem("userRole", user.role);  
      localStorage.setItem("userEmail", user.email); // optional

      toast.success(`Welcome, ${user.role}!`);
      navigate(`/${user.role}`);
    } else {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 px-10 transition-all duration-500 ease-in-out">

      {/* Heading */}
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-semibold text-gray-800">Welcome Back</CardTitle>
        <CardDescription className="text-gray-500">
          Choose your role and sign in to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Role Selection */}
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="admin" 
              onClick={() => setSelectedRole("admin")}
              className={clsx(
                "flex items-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                selectedRole === "admin"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-blue-100"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger 
              value="tester" 
              onClick={() => setSelectedRole("tester")}
              className={clsx(
                "flex items-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                selectedRole === "tester"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700 hover:bg-green-100"
              )}
            >
              <User className="h-4 w-4" />
              Tester
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>

      {/* Input Fields */}
      <div className="space-y-5 text-left">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              placeholder="role@testmagic.com"
              value={enteredEmail}
              onChange={(e) => { setEnteredEmail(e.target.value); setErrors({ ...errors, email: '' }) }}
              className="pl-10 h-11 w-full rounded-lg border border-gray-300 bg-white text-base px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              value={enteredPassword}
              onChange={(e) => { setEnteredPassword(e.target.value); setErrors({ ...errors, password: '' }) }}
              className="pl-10 h-11 w-full rounded-lg border border-gray-300 bg-white text-base px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
      </div>

      {/* Sign In Button */}
      <button
        onClick={signIn}
        className={clsx(
          "w-full my-6 rounded-lg py-3 font-semibold transition-all duration-300",
          selectedRole === "admin"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : selectedRole === "tester"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-400 text-white cursor-not-allowed"
        )}
        disabled={!selectedRole}
      >
        {selectedRole ? `Sign in as ${selectedRole}` : "Select Role to Sign in"}
      </button>

    </Card>
  )
}

export default Login
