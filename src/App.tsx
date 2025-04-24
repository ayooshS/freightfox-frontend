// src/App.tsx
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
// import SignInPage from "@/pages/sign_in.tsx";
import {NewOrderPage} from "@/pages/New_order.tsx";
import AppShell from "@/components/AppShell.tsx";
import {ActiveTripsPage} from "@/pages/active_trips.tsx";
import {MyOrdersPage} from "@/pages/my_orders.tsx";
import OrderDetailPage from "@/pages/schedule_order.tsx";




function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/sign-in" element={<SignInPage />} />*/}
                <Route element={<AppShell />}>
                    <Route path="/New-orders" element={<NewOrderPage />} />
                    <Route path="/Active-trips" element={<ActiveTripsPage />} />
                    <Route path="/My-orders" element={<MyOrdersPage />} />
                </Route>
                <Route path="/" element={<Navigate to="/New-orders" />} />
                <Route path="/order-detail" element={<OrderDetailPage />} />



            </Routes>
        </BrowserRouter>
    )
}

export default App
