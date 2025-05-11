import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError('');
    try {
      await signIn(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mb-2" />
          <CardTitle className="text-2xl font-bold text-blue-800">Admin Login</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-red-600 text-center text-sm">
                {error}
              </div>
            )}
            <FormField label="Email" htmlFor="email" error={typeof errors.email?.message === 'string' ? errors.email.message : undefined} required>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="admin@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
            </FormField>
            <FormField label="Password" htmlFor="password" error={typeof errors.password?.message === 'string' ? errors.password.message : undefined} required>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  placeholder="********"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </FormField>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md"
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;