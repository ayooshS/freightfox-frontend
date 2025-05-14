// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewOrderPage } from "@/pages/New_order.tsx";
import AppShell from "@/components/AppShell.tsx";
import { ActiveTripsPage } from "@/pages/active_trips.tsx";
import { MyOrdersPage } from "@/pages/my_orders.tsx";
import OrderDetailPage from "@/pages/order_detail.tsx";
import SignInPage from "@/login";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAutoLogin } from "@/hooks/useAutoLogin";

function AppContent() {
    useAutoLogin();


    return (
        <Routes>
            <Route path="/" element={<SignInPage />} />

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
