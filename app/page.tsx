'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Input, Logo, ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { Users, BarChart3, Bell, Zap } from 'lucide-react';

interface FeatureBulletProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureBullet({ icon, title, description, delay }: FeatureBulletProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 p-3 rounded-xl bg-mint/20 text-mint">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/60 mt-1">{description}</p>
      </div>
    </motion.div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 lg:flex-[0.6] flex flex-col login-left-panel relative">
        {/* Theme toggle */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8"
        >
          <Logo size="md" />
        </motion.div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-sm"
          >
            {/* Heading */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-2xl font-bold text-text-primary"
              >
                Sign in to 1nData
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-text-secondary mt-2"
              >
                Welcome back! To continue, sign in to your account
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-5"
            >
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="glass-input"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="glass-input"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-6"
              >
                Continue
              </Button>
            </motion.form>

            {/* Demo notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-center text-xs text-text-muted mt-8"
            >
              Demo mode: Any email and password will work
            </motion.p>

            {/* Sign up link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center text-sm text-text-secondary mt-4"
            >
              Don't have an account?{' '}
              <span className="text-mint font-medium cursor-pointer hover:underline">
                Sign up
              </span>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Feature Showcase (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex lg:flex-[0.4] login-right-panel flex-col justify-center p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-mint/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-vista-blue/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Smart Referral
              <br />
              <span className="text-mint">Management</span>
            </h2>
            <p className="text-white/60">
              Streamline your clinical trial patient referrals with intelligent automation and real-time insights.
            </p>
          </motion.div>

          {/* Feature bullets */}
          <div className="space-y-6">
            <FeatureBullet
              icon={<Users className="w-5 h-5" />}
              title="Streamlined Workflows"
              description="Manage patient referrals from intake to enrollment"
              delay={0.4}
            />
            <FeatureBullet
              icon={<BarChart3 className="w-5 h-5" />}
              title="Real-time Analytics"
              description="Track conversion rates and team performance"
              delay={0.5}
            />
            <FeatureBullet
              icon={<Bell className="w-5 h-5" />}
              title="Automated Reminders"
              description="Never miss a follow-up with smart notifications"
              delay={0.6}
            />
            <FeatureBullet
              icon={<Zap className="w-5 h-5" />}
              title="Fast Dialer Sessions"
              description="Power through call lists with our optimized dialer"
              delay={0.7}
            />
          </div>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-white/40 text-sm">
              Trusted by leading clinical research sites
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </ThemeProvider>
  );
}
