import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import {JSX} from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
	const isAuth = useSelector((state: RootState) => state.auth.isauthenticated);

	if (!isAuth) {
		return <Navigate to="/" replace />;
	}

	return children;
}
