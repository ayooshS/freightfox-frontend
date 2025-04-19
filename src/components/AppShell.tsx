// components/AppShell.jsx
import {Outlet, useLocation} from "react-router-dom"
import BottomNav from "@/components/Navigation/BottomNavigation.tsx";
import HeaderNav from "@/components/Navigation/header_navigation.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";



export default function AppShell() {
    const location = useLocation()

    return (
        <main className="min-h-[100dvh] flex justify-center">
            <div className="w-full max-w-[480px] bg-surface-secondary flex flex-col h-[100dvh]">

                {/* Static top section */}
                <div className="flex pt-8 px-4 pb-8">
                    <HeaderNav />
                </div>



                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto px-4">
                    <Outlet />
                </div>

                {/* Sticky bottom navigation */}
                <div className="sticky bottom-0">
                    <BottomNav activePath={location.pathname} />
                </div>
            </div>
            {/* Mount the toast system */}
            <Toaster position="bottom-center" richColors closeButton />
        </main>
    )
}

