// components/BottomNav.jsx
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import {Button} from "@/components/ui/button.tsx";
import {
    DocumentTableTruck24Regular,
    DocumentTableTruck24Filled,
    LocationLive24Regular,
    LocationLive24Filled,
    Box24Regular,
    Box24Filled,
} from "@fluentui/react-icons"

const navItems = [
    {
        name: "New Orders",
        path: "/New-orders",
        icon: DocumentTableTruck24Regular,
        iconFilled: DocumentTableTruck24Filled,
    },
    {
        name: "Active Trips",
        path: "/Active-trips",
        icon: LocationLive24Regular,
        iconFilled: LocationLive24Filled,
    },
    {
        name: "My Orders",
        path: "/My-orders",
        icon: Box24Regular,
        iconFilled: Box24Filled,
    },
]

type PathProp = {
    activePath: string;

};

export default function BottomNav({ activePath }: PathProp) {
    const navigate = useNavigate()

    return (
        <div className="shadow-customprimary flex justify-around bg-white p-xl-mobile pb-xxl-mobile pt-xl-mobile">
            {navItems.map((item) => {

                const isActive = activePath === item.path
                const Icon = isActive ? item.iconFilled : item.icon

                return (
                    <Button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "flex flex-col items-center font-caption-sm-mobile",
                            isActive ? "text-text-information" : "text-text-tertiary"
                        )}
                    >
                        <Icon style={{ width: 24, height: 24 }} />
                        <span>{item.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}
