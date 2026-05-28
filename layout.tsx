import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 bg-white font-sans antialiased text-[#172b4d]">
        <div id="advantage-teams-root" className="flex h-full min-h-screen overflow-hidden">
          
          {/* LEFT-HAND VERTICAL NAVIGATION SIDEBAR */}
          <aside 
            id="workspace-sidebar"
            className="w-[240px] shrink-0 border-r border-[#dfe1e6] bg-[#f4f5f7] h-full flex flex-col justify-between select-none"
          >
            <div>
              {/* App Brand Header */}
              <div id="sidebar-header" className="h-[52px] px-4 flex items-center gap-2.5 border-b border-[#dfe1e6] bg-white">
                <div className="w-6 h-6 rounded-[3px] bg-[#0052cc] flex items-center justify-center text-white font-bold text-[11px] font-mono shadow-xs">
                  AT
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#172b4d] text-[13.5px] tracking-tight leading-tight">Advantage Teams</span>
                  <span className="text-[9.5px] text-[#5e6c84] leading-tight font-semibold tracking-wider uppercase">Enterprise Desk</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="px-4 py-4">
                <span className="text-[10px] font-bold text-[#5e6c84] tracking-wider uppercase">Workspace Modules</span>
              </div>

              <nav className="flex flex-col gap-0.5">
                <Link 
                  href="/dashboard?view=productivity"
                  id="nav-link-performance"
                  className="flex items-center gap-3 h-[36px] px-4 text-[12px] text-[#172b4d] hover:bg-[#ebecf0] transition-colors border-l-[3px] border-transparent font-medium"
                >
                  <span className="text-[14px]">📊</span>
                  <span className="truncate">Performance Review</span>
                </Link>
                <Link 
                  href="/dashboard?view=surveys"
                  id="nav-link-surveys"
                  className="flex items-center gap-3 h-[36px] px-4 text-[12px] text-[#172b4d] hover:bg-[#ebecf0] transition-colors border-l-[3px] border-transparent"
                >
                  <span className="text-[14px]">📞</span>
                  <span className="truncate">Survey Management</span>
                </Link>
              </nav>

              <div className="px-4 py-4 mt-2 border-t border-[#dfe1e6]/60">
                <span className="text-[10px] font-bold text-[#5e6c84] tracking-wider uppercase">Database Logs</span>
              </div>

              <nav className="flex flex-col gap-0.5 font-mono text-[10.5px]">
                <Link 
                  href="/dashboard?view=seed"
                  className="flex items-center gap-2 h-[28px] px-4 text-[#5e6c84] hover:bg-[#ebecf0] hover:text-[#172b4d] transition-colors"
                >
                  seed.sql
                </Link>
              </nav>
            </div>

            {/* User Avatar Action Row at Base */}
            <div id="sidebar-footer-profile" className="p-3 border-t border-[#dfe1e6] bg-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-[12px] select-none shadow-xs">
                OP
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11.5px] font-bold text-[#172b4d] truncate">Operations Manager</span>
                <span className="text-[9.5px] text-[#5e6c84] truncate">ID: AD-7192</span>
              </div>
            </div>
          </aside>

          {/* MAIN CANVAS SCROLLBOX VIEWPORT */}
          <main 
            id="view-scrollbox-viewport" 
            className="flex-1 h-full min-h-screen overflow-y-auto bg-white p-6"
          >
            <div className="max-w-[1200px] mx-auto h-full flex flex-col">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
