'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FilePlus2, LayoutDashboard, UserCog, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    href: '/dashboard/file-claim',
    icon: FilePlus2,
    label: 'File a Claim',
  },
  {
    href: '/dashboard/track-claim',
    icon: LayoutDashboard,
    label: 'Track Claim',
  },
  {
    href: '/dashboard/admin',
    icon: UserCog,
    label: 'Admin',
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
       <SidebarMenuItem className="mt-auto">
          <SidebarMenuButton asChild tooltip="Logout">
            <Link href="/login">
              <LogOut />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}
