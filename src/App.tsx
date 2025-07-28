import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TopMovers from "./pages/TopMovers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="crypto-tracker-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/top-movers" element={<AppLayout><TopMovers /></AppLayout>} />
            <Route path="/portfolio" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Portfolio Tracker</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/watchlist" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Watchlist</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/news" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">News & Insights</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/settings" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
