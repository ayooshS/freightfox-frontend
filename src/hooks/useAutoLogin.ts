import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slice/authentication";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

type GooglePayload = {
	name?: string;
	email?: string;
	picture?: string;
	exp: number;
};

export function useAutoLogin() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// ✅ Skip auto-login check on /sessions route
		if (location.pathname === "/sessions") return;

		const token = localStorage.getItem("auth_token");
		const userMeta = localStorage.getItem("user_meta");

		if (!token) {
			dispatch(logout());
			if (location.pathname !== "/") {
				navigate("/", { replace: true });
			}
			return;
		}

		try {
			const decoded = jwtDecode<GooglePayload>(token);
			const meta = userMeta ? JSON.parse(userMeta) : {};

			// Token expired
			if (decoded.exp * 1000 < Date.now()) {
				console.warn("Token expired");
				localStorage.removeItem("auth_token");
				dispatch(logout());
				if (location.pathname !== "/") {
					navigate("/", { replace: true });
				}
				return;
			}

			// ✅ Dispatch with fallback to meta
			dispatch(
				login({
					isauthenticated: true,
					name: decoded.name ?? meta.name ?? undefined,
					email: decoded.email ?? meta.email ?? undefined,
					picture: decoded.picture ?? meta.picture ?? undefined,
					exp: decoded.exp,
				})
			);

			// If on root route, navigate to dashboard
			if (location.pathname === "/") {
				navigate("/New-orders?transporter_id=T100", { replace: true });
			}
		} catch (error) {
			console.error("❌ Failed to decode token", error);
			localStorage.removeItem("auth_token");
			dispatch(logout());
			if (location.pathname !== "/") {
				navigate("/", { replace: true });
			}
		}
	}, [dispatch, navigate, location]);
}
