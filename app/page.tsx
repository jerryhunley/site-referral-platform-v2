'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard, Button, Input, Logo, ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider } from '@/lib/context/AuthContext';

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
    <div className="app-background min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="background-orb background-orb-1" />
      <div className="background-orb background-orb-2" />

      {/* Theme toggle in corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <GlassCard variant="elevated" padding="lg" className="relative">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center mb-4"
            >
              <Logo size="lg" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-text-secondary text-sm"
            >
              Site Referral Platform
            </motion.p>
          </div>

          {/* Login form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
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
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Sign In
            </Button>
          </motion.form>

          {/* Demo notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center text-xs text-text-muted mt-6"
          >
            Demo mode: Any email and password will work
          </motion.p>
        </GlassCard>
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
