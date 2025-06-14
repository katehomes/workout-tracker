import React from 'react';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  leftPanel?: React.ReactNode;
  children: React.ReactNode; // main content
  rightPanel?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  leftPanel,
  children,
  rightPanel,
}) => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 overflow-hidden">
        {/* Optional Left Panel */}
        {leftPanel && (
          <aside className="w-64 bg-gray-100 border-r overflow-y-auto custom-scrollbar">
            {leftPanel}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {children}
        </main>

        {/* Optional Right Panel */}
        {rightPanel && (
          <aside className="w-100 bg-gray-50 border-l overflow-y-auto custom-scrollbar">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
