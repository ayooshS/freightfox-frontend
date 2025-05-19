import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/authentication";
import { Card } from "@/components/ui/card";
import { umsClient } from "@/lib/apiHelper";
import { decodeJwtToken, setJwtToken, setUserDetails } from "@/utils/authUtils";
import { jwtDecode } from "jwt-decode";

type AuthVerifyResponse = {
	jwt_token?: string;
	sessions_available: boolean;
	encrypted_token?: string;
	active_sessions?: any[];
};

export default function SignInPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<main className="min-h-[100dvh] flex justify-center items-center bg-surface-secondary">
			<div className="w-full max-w-[480px] p-4 bg-surface-tertiary h-[100dvh] flex items-center justify-center">
				<Card className="w-full rounded-xl-mobile bg-surface-primary px-6 py-8 space-y-6 flex flex-col items-center text-center">
					<img src="/Logo.svg" alt="logo" className="h-7 w-auto max-w-[120px]" />

					<h1 className="font-subtitle-lg-mobile text-text-primary">
						Welcome to FreightFox
					</h1>

					<GoogleLogin
						width="300"
						onSuccess={async (credentialResponse) => {
							const googleToken = credentialResponse.credential;
							if (!googleToken) return;

							try {
								const response = await umsClient.post<AuthVerifyResponse>(
									"/auth-verify",
									{},
									{
										headers: {
											Authorization: googleToken,
											IdentityProvider: "google",
											Source: "InternalApp",
										},
									}
								);

								console.log("✅ Auth Verify Response:", response);

								const { jwt_token, sessions_available, encrypted_token, active_sessions } = response.data;

								if (jwt_token && sessions_available) {
									setJwtToken(jwt_token);
									localStorage.setItem("auth_token", jwt_token); // 👈 required for useAutoLogin

									const decoded: any = decodeJwtToken(jwt_token);
									const googleDecoded: any = jwtDecode(googleToken); // decode Google credential


									// Save to localStorage for useAutoLogin fallback
									localStorage.setItem("user_meta", JSON.stringify({
										name: googleDecoded.name,
										email: googleDecoded.email,
										picture: googleDecoded.picture,
									}));


									setUserDetails(decoded);

									const payload = {
										isauthenticated: true,
										name: decoded.name ?? googleDecoded.name,
										email: decoded.email ?? googleDecoded.email,
										picture: decoded.picture ?? googleDecoded.picture,
										exp: decoded.exp,
									};

									console.log("📦 Dispatching login payload:", payload);
									dispatch(login(payload));

									navigate("/New-orders?transporter_id=T100");
								} else if (encrypted_token && !sessions_available) {
									localStorage.setItem("enc_token", encrypted_token);
									console.log("Navigating to sessions", active_sessions);
									navigate("/sessions", { state: { sessions: active_sessions } });
								}
							} catch (error) {
								console.error("❌ Login failed at /auth-verify:", error);
							}
						}}
						onError={() => {
							console.log("Google Login Failed");
						}}
					/>
				</Card>
			</div>
		</main>
	);
}
