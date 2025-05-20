import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar.tsx"
import { useHeaderAction } from "@/HeaderActionContext"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export default function HeaderNav() {
    const [greeting, setGreeting] = useState("")

    // 🔥 Grab user info from Redux
    const { name, email } = useSelector((state: RootState) => state.auth)
    const { action } = useHeaderAction()

    useEffect(() => {
        const hour = new Date().getHours()
        let baseGreeting = ""
        if (hour < 12) {
            baseGreeting = "Good Morning"
        } else if (hour < 17) {
            baseGreeting = "Good Afternoon"
        } else {
            baseGreeting = "Good Evening"
        }

        // 🎯 Include user's first name if available
        if (name) {
            setGreeting(`${baseGreeting}  ${name.split(" ")[0]} 👋`)
        } else {
            setGreeting(baseGreeting)
        }
    }, [name])

    return (
        <div className="justify-center items-stretch z-0 flex w-full flex-col gap-3">
            <div className="flex w-full gap-1.5 items-center justify-between">
                {/* Left section */}
                <div className="flex gap-1.5 items-center">
                    <Avatar
                        variant="text"
                        fallbackText={name?.[0]?.toUpperCase() || "U"}
                        bgColor="bg-purple-500"
                    />
                    <div className="flex flex-col">
                        <div className="font-body-base-mobile text-text-primary">{greeting}</div>
                        <div className="font-caption-sm-mobile text-text-tertiary">
                            {email || "Logged-in user"}
                        </div>
                    </div>
                </div>

                {/* Right: contextual button */}
                {action && <div>{action}</div>}
            </div>
        </div>
    )
}
