import { Link, useLocation } from "wouter";
import { Terminal, History, Code2, Cpu } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Cpu className="w-5 h-5" /> },
    { href: "/scripts", label: "Scripts", icon: <Code2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col fixed h-full bg-card/50 backdrop-blur-md z-10 hidden md:flex">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight font-mono">EXECUTOR</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-primary/15 text-primary shadow-sm border border-primary/20" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50">
          <div className="text-xs text-muted-foreground font-mono">
            v1.0.0-beta
            <br />
            System Status: <span className="text-green-500">Online</span>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Placeholder - hidden on desktop */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-card border-b border-border z-20 flex items-center px-4 justify-between">
         <div className="flex items-center gap-2 text-primary font-bold font-mono">
           <Terminal className="w-5 h-5" /> EXECUTOR
         </div>
         <nav className="flex gap-4">
           <Link href="/scripts" className="text-sm font-medium">Scripts</Link>
         </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
