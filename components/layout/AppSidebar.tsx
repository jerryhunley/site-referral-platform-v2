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
  FileEdit,
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
  { href: '/form-builder', label: 'Form Builder', icon: FileEdit },
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
      className="h-[calc(100vh-24px)] my-3 ml-3"
    >
      {/* Logo Section */}
      <SidebarHeader className="px-4 py-4">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-start pl-2"
        )}>
          {!isCollapsed ? (
            <Logo size="sm" />
          ) : (
            <Logo size="sm" showText={false} />
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup className="p-0">
          <SidebarMenu className="space-y-1.5">
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
                        ? 'bg-[radial-gradient(circle_at_bottom_right,#53CA97_0%,#42a279_50%)] text-white shadow-md shadow-mint/25 hover:bg-[radial-gradient(circle_at_bottom_right,#5ED4A3_0%,#4AAE85_50%)] hover:text-white data-[active=true]:bg-[radial-gradient(circle_at_bottom_right,#53CA97_0%,#42a279_50%)] data-[active=true]:text-white'
                        : 'text-text-primary hover:bg-white/90 dark:hover:bg-white/15 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className={cn('w-5 h-5', isActive && 'text-white dark:text-[#1A2B28]')} />
                      <span className="text-sm font-medium">{item.label}</span>
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
      <SidebarFooter className="px-4 py-3">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-3 pl-2"
        )}>
          {/* Avatar - uses original mint for brand accent */}
          <div className="w-8 h-8 rounded-full bg-mint/15 flex items-center justify-center text-mint font-semibold text-sm shrink-0">
            {user ? getUserInitials(user) : 'U'}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-medium text-text-primary truncate text-sm">
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
