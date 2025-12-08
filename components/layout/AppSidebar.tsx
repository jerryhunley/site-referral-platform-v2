'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Phone,
  Settings,
  LogOut,
  BarChart3,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { useProTier } from '@/lib/context/ProTierContext';
import { getUserInitials, getUserFullName } from '@/lib/mock-data/users';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/referrals', label: 'Referrals', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, isPro: true },
  { href: '/working-session', label: 'Working Session', icon: Phone },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function SidebarToggleButton() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <button
      onClick={toggleSidebar}
      className="absolute top-1/2 -right-3 w-6 h-6 rounded-full sidebar-collapse-btn flex items-center justify-center z-20"
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <ChevronRight className="w-3.5 h-3.5" />
      ) : (
        <ChevronLeft className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isPro } = useProTier();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className={cn(
        'h-[calc(100vh-24px)] my-3 ml-3',
        // Override shadcn defaults with glassmorphic styling
        '[&_[data-sidebar=sidebar]]:floating-sidebar',
        '[&_[data-sidebar=sidebar]]:!bg-transparent',
        '[&_[data-sidebar=sidebar]]:!rounded-2xl'
      )}
    >
      {/* Logo Section */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <Logo size="md" />
          ) : (
            <div className="flex justify-center w-full">
              <Logo size="sm" showText={false} />
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const showProBadge = item.isPro && !isPro;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={cn(
                      'rounded-2xl transition-all duration-200',
                      isActive
                        ? 'bg-mint text-white shadow-md shadow-mint/25 hover:bg-mint hover:text-white data-[active=true]:bg-mint data-[active=true]:text-white'
                        : 'text-text-secondary hover:bg-white/60 dark:hover:bg-white/10 hover:text-text-primary'
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className={cn('w-5 h-5', isActive && 'text-white')} />
                      <span className="font-medium">{item.label}</span>
                      {/* PRO Badge */}
                      {!isCollapsed && showProBadge && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 ml-auto">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                            Pro
                          </span>
                        </span>
                      )}
                      {/* Unlocked sparkle */}
                      {!isCollapsed && item.isPro && isPro && (
                        <Sparkles className="w-4 h-4 text-mint ml-auto" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Custom Toggle Button */}
      <SidebarToggleButton />

      {/* User Section */}
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold flex-shrink-0">
            {user ? getUserInitials(user) : 'U'}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-medium text-text-primary truncate">
                  {user ? getUserFullName(user) : 'User'}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>

      {/* Rail for drag resize (optional) */}
      <SidebarRail />
    </Sidebar>
  );
}
