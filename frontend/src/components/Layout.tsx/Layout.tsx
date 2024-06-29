import React from 'react';
import Footer from './Footer';
import Nav from './Nav';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-fit min-h-screen">
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
