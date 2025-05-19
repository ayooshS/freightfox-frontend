// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewOrderPage } from "@/pages/New_order.tsx";
import AppShell from "@/components/AppShell.tsx";
import { ActiveTripsPage } from "@/pages/active_trips.tsx";
import { MyOrdersPage } from "@/pages/my_orders.tsx";
import OrderDetailPage from "@/pages/order_detail.tsx";
import SignInPage from "@/login";
 // ✅ Add this import
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import SessionsPage from "@/Sessions.tsx";


function AppContent() {
    useAutoLogin();

    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/sessions" element={<SessionsPage />} />

            <Route
                element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }
            >
                <Route path="/New-orders" element={<NewOrderPage />} />
                <Route path="/Active-trips" element={<ActiveTripsPage />} />
                <Route path="/My-orders" element={<MyOrdersPage />} />
            </Route>

            <Route
                path="/order-detail"
                element={
                    <ProtectedRoute>
                        <OrderDetailPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
