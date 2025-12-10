import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  title: string;
  subtitle: string;
}

export default function Layout({ children, currentPage, onNavigate, title, subtitle }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F5EDE4] to-[#E8D5C4]">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <Header title={title} subtitle={subtitle} />
          <div className="animate-fadeIn">{children}</div>
        </div>
      </div>
    </div>
  );
}
