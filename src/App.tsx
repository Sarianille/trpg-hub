import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/sign-up-form'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { UpdatePasswordForm } from '@/components/update-password-form'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/update-password" element={<UpdatePasswordForm />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}