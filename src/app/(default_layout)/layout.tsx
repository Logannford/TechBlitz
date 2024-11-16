import type { Metadata } from 'next';
import { InterFont, SatoshiFont, UbuntuFont } from '../styles/fonts/font';
import '../globals.css';
import { ReactQueryClientProvider } from '@/components/react-query-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { HydrationOverlay } from '@builder.io/react-hydration-overlay';
import { AppSidebar } from '@/components/global/navigation/sidebar';

import { createTheme, MantineProvider } from '@mantine/core';
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

export const metadata: Metadata = {
  title: 'TechBlitz',
  description: 'Improve your code knowledge, one day at a time.',
};

const theme = createTheme({});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body
          className={`${InterFont.variable} ${SatoshiFont.variable} ${UbuntuFont.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <SidebarProvider>
            {/* Fixed background gradient */}
            {/* <div className="fixed inset-0 bg-gradient-to-t from-[#f0db4f]/5 via-transparent to-transparent pointer-events-none"></div> */}

            {/* Scrollable content */}
            <AppSidebar />
            <main className="w-full pr-6 py-6 lg:pt-6 lg:pb-3">
              <div className="lg:pl-4 h-[95%]">
                <MantineProvider>{children}</MantineProvider>
              </div>
            </main>
            <Toaster className="bg-black" />
          </SidebarProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
