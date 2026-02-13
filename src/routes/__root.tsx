import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const rootRoute = createRootRoute({
  component: RootLayout,
});
