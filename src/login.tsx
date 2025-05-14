import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/authentication";
import { Card } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";

type GooglePayload = {
	name: string;
	email: string;
	picture: string;
	exp: number;
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
						onSuccess={(credentialResponse) => {
							const token = credentialResponse.credential;

							if (token) {
								const decoded = jwtDecode<GooglePayload>(token);
								console.log("Decoded exp (ms):", decoded.exp * 1000);
								console.log("Readable:", new Date(decoded.exp * 1000).toString());

								localStorage.setItem("auth_token", token);

								dispatch(login({
									isauthenticated: true,
									name: decoded.name,
									email: decoded.email,
									picture: decoded.picture,
									exp: decoded.exp,
								}));

								navigate("/New-orders?transporter_id=T100");
							}
						}}
						onError={() => {
							console.log("Login Failed");
						}}
					/>
				</Card>
			</div>
		</main>
	);
}
