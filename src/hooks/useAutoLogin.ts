import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slice/authentication";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

type GooglePayload = {
	name: string;
	email: string;
	picture: string;
	exp: number; // Token expiry (UNIX timestamp in seconds)
};

export function useAutoLogin() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem("auth_token");

		if (!token) {
			dispatch(logout());
			if (location.pathname !== "/") {
				navigate("/", { replace: true });
			}
			return;
		}

		try {
			const decoded = jwtDecode<GooglePayload>(token);

			// Check if token has expired
			if (decoded.exp * 1000 < Date.now()) {
				console.warn("Token expired");
				localStorage.removeItem("auth_token");
				dispatch(logout());
				if (location.pathname !== "/") {
					navigate("/", { replace: true });
				}
				return;
			}

			// Rehydrate Redux store with user data
			dispatch(
				login({
					isauthenticated: true,
					name: decoded.name,
					email: decoded.email,
					picture: decoded.picture,
				})
			);

			// If already on the login page, redirect to dashboard
			if (location.pathname === "/") {
				navigate("/New-orders?transporter_id=T100", { replace: true });
			}

		} catch (error) {
			console.error("Failed to decode token", error);
			localStorage.removeItem("auth_token");
			dispatch(logout());
			if (location.pathname !== "/") {
				navigate("/", { replace: true });
			}
		}
	}, [dispatch, navigate, location]);
}
