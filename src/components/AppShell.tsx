import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import BottomNav from "@/components/Navigation/BottomNavigation.tsx"
import HeaderNav from "@/components/Navigation/header_navigation.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import {HeaderActionProvider} from "@/HeaderActionContext";

export default function AppShell() {
    const location = useLocation()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showShadow, setShowShadow] = useState(false)



    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return
            const scrollTop = scrollRef.current.scrollTop
            setShowShadow(scrollTop > 0)
        }

        const scrollEl = scrollRef.current
        if (scrollEl) {
            scrollEl.addEventListener("scroll", handleScroll)
        }

        return () => {
            if (scrollEl) {
                scrollEl.removeEventListener("scroll", handleScroll)
            }
        }
    }, [])



    return (
        <main className="min-h-[100dvh] flex justify-center">
            <HeaderActionProvider>
                <div className="w-full max-w-[480px] bg-surface-secondary flex flex-col h-[100dvh]">
                    {/* Static top section */}
                    <div className="flex pt-8 px-4 pb-8 transition-shadow duration-300"
                         style={{ boxShadow: showShadow ? "0 8px 24px rgba(149, 157, 165, 0.12)" : "none" }}>
                        <HeaderNav />
                    </div>

                    {/* Scrollable content area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 pb-4 scroll-smooth"
                    >
                        <Outlet />
                    </div>

                    {/* Sticky bottom navigation */}
                    <div className="sticky bottom-0">
                        <BottomNav activePath={location.pathname} />
                    </div>
                </div>
            </HeaderActionProvider>

            <Toaster position="bottom-center" richColors closeButton />
        </main>
    )
}
