import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Desktop24Regular,
	Phone24Regular,
	Delete24Regular,
} from "@fluentui/react-icons"
import {
	getSessions,
	deleteSessions,
	logoutFunc,
	getLocalStorageData,
} from "@/utils/authUtils"

interface Session {
	sessionId: number
	userId: number
	lastSignInTime: string
	platform: string
	userAgent: string
	currentSession: boolean
	parsedUserAgent: {
		os: string
		browser: string
		device: string
		osVersion: string
		browserVersion: string
	}
}

export default function SessionsPage() {
	const location = useLocation()
	const navigate = useNavigate()
	const [activeSessions, setActiveSessions] = useState<Session[]>(
		location.state?.sessions || []
	)

	useEffect(() => {
		const fetchSessions = async () => {
			if (activeSessions.length === 0) {
				try {
					const response = await getSessions()
					const sessions = (response as unknown as { data: Session[] }).data
					setActiveSessions(sessions)
				} catch (error) {
					console.error("❌ Failed to fetch sessions", error)
				}
			}
		}
		void fetchSessions()
	}, [activeSessions.length])

	const handleDelete = async (sessionId: number) => {
		try {
			await deleteSessions(sessionId, localStorage.getItem("enc_token")!)
			setActiveSessions((prev) =>
				prev.filter((session) => session.sessionId !== sessionId)
			)
		} catch (err) {
			console.error("❌ Error deleting session", err)
		}
	}

	const getDeviceIcon = (device: string): React.ReactNode => {
		switch (device.toLowerCase()) {
			case "windows":
			case "mac":
			case "desktop":
				return <Desktop24Regular />
			case "android":
			case "iphone":
			case "phone":
				return <Phone24Regular />
			default:
				return <Desktop24Regular />
		}
	}

	return (
		<main className="min-h-[100dvh] flex justify-center items-start bg-surface-primary">
			<div className="w-full max-w-[480px] bg-surface-secondary h-[100dvh] flex flex-col overflow-hidden">

				{/* Sticky Header */}
				<div className="sticky top-0 z-10 bg-surface-secondary px-4 pt-4 pb-6 flex flex-col items-start space-y-2">
					<div>
						<h2 className="font-subtitle-lg-mobile text-text-primary">{activeSessions.length} Active Sessions</h2>
						<p className="font-body-base-mobile text-text-secondary">
							Only 2 Active Sessions are allowed. Please delete others to continue.
						</p>
					</div>
				</div>

				{/* Scrollable Session List */}
				<div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-8">
					{activeSessions.map(session => (
						<Card
							key={session.sessionId}
							className="bg-surface-primary border border-none rounded-xl-mobile shadow-customprimary"
						>
							<CardContent className="flex items-start justify-between gap-4 p-4 flex-wrap">
								<div className="flex items-start">
									<div className="space-y-1">
										<CardTitle className="text-text-primary font-body-lg-mobile">
											{session.platform === "InternalApp" ? "Bizongo Internal" : session.platform}
										</CardTitle>
										<div className="flex gap-2 flex-wrap">
											<Badge
												variant="custom"
												icon={getDeviceIcon(session.parsedUserAgent.device)}
												text={`${session.parsedUserAgent.os} ${session.parsedUserAgent.osVersion}`}
												bgColor="bg-muted text-text-secondary"
											/>
											<Badge
												variant="default"
												text={`${session.parsedUserAgent.browser} ${session.parsedUserAgent.browserVersion}`}
											/>
										</div>
										<p className="font-overline-sm-mobile text-text-tertiary pt-2">
											Last signed in at {session.lastSignInTime}
										</p>
									</div>
								</div>

								<div className="flex gap-2 mt-2 sm:mt-0">
									{session.currentSession ? (
										<Badge variant="custom" text="This Device" bgColor="bg-green-100 text-green-700" />
									) : (
										<Button
											variant="destructive"
											size="default"
											onClick={() => handleDelete(session.sessionId)}
										>
											<Delete24Regular className="text-text-error" />
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Sticky Footer */}
				<div className="sticky bottom-0 z-10 bg-surface-primary px-4 pt-4 pb-6 shadow-customprimary">
					{getLocalStorageData("enc_token") && (
						<Button
							variant="default"
							size="lg"
							className="w-full"
							onClick={() => {
								logoutFunc()
								navigate("/login")
							}}
							disabled={activeSessions.length > 2}
						>
							Continue to Login
						</Button>
					)}
				</div>
			</div>
		</main>
	)

}
