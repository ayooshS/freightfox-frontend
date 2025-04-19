// components/BottomNav.jsx


import {Avatar} from "@/components/ui/avatar.tsx";

export default function HeaderNav() {


    return (
        <div className="justify-center items-stretch z-0 flex w-full flex-col gap-3">
            <div className="flex w-full gap-1.5">

                    <div>
                        <Avatar variant="text" fallbackText="T" bgColor="bg-purple-500" />
                    </div>

                <div className="flex flex-col items-stretch justify-center flex-1">
                    <div className="w-full font-body-base-mobile text-text-primary gap-2">
                        Good Morning
                    </div>
                    <div className="w-full font-caption-sm-mobile text-text-tertiary">
                        Triple MMM Logysmart Private Limited
                    </div>
                </div>
            </div>
        </div>
    )
}
