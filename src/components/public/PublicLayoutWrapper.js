'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingDonateButton from './FloatingDonateButton';

export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname() || '';
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');
  
  const showPublicElements = !isAdminPage && !isAuthPage;

  return (
    <>
      {showPublicElements && <Navbar />}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {showPublicElements && <FloatingDonateButton />}
      {showPublicElements && <Footer />}
    </>
  );
}
