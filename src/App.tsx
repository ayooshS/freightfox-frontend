// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignInPage from "@/pages/sign_in.tsx";
import {DashboardPage} from "@/pages/dashboard.tsx";




function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App
