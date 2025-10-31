import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ShieldCheck } from 'lucide-react';
import { UserNav } from '@/components/dashboard/user-nav';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="h-10 w-10 p-2 text-primary">
              <Link href="/">
                <ShieldCheck className="size-full" />
              </Link>
            </Button>
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-sidebar-foreground">
                AI Claims Ace
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-30">
          <SidebarTrigger className="sm:hidden" />
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
