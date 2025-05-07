import { useNavigate, useSearchParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button.tsx"
import {
    DocumentTableTruck24Regular,
    DocumentTableTruck24Filled,
    Box24Regular,
    Box24Filled,
} from "@fluentui/react-icons"
import { useState } from "react"

const navItems = [
    {
        name: "New Orders",
        path: "/New-orders",
        icon: DocumentTableTruck24Regular,
        iconFilled: DocumentTableTruck24Filled,
    },
    {
        name: "My Orders",
        path: "/My-orders",
        icon: Box24Regular,
        iconFilled: Box24Filled,
    },
]

type PathProp = {
    activePath: string
}

export default function BottomNav({ activePath }: PathProp) {
    const [searchParams] = useSearchParams()
    const transporterID: string = searchParams.get("transporter_id")!
    const navigate = useNavigate()
    const [clickedIndex, setClickedIndex] = useState<number | null>(null)

    function handleClick(index: number, path: string) {
        setClickedIndex(index)

        // Optional: Haptic touch


        setTimeout(() => {
            navigate(path + `?transporter_id=${transporterID}`)
            setClickedIndex(null)
        },35) // let animation play
    }

    return (
        <div className="shadow-customprimary flex justify-around bg-white p-xl-mobile pb-xxl-mobile pt-xl-mobile">
            {navItems.map((item, index) => {
                const isActive = activePath === item.path
                const Icon = isActive ? item.iconFilled : item.icon
                const isClicked = clickedIndex === index

                return (
                    <Button
                        key={item.name}
                        onClick={() => handleClick(index, item.path)}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "group flex flex-col items-center font-caption-sm-mobile transition-all duration-200",
                            isActive ? "text-text-information" : "text-text-tertiary"
                        )}
                    >
                        <Icon
                            style={{ width: 24, height: 24 }}
                            className={cn(
                                "transition-transform duration-150 ease-in-out",
                                isClicked ? "scale-80" : "scale-100"
                            )}
                        />
                        <span>{item.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}
