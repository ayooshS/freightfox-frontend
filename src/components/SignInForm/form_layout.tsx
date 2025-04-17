// src/components/SignInForm/FormLayout.tsx

import {ReactNode} from "react"

type FormLayoutProps = {
    title: string
    children: ReactNode
}

export function FormLayout({
                               title,
                               children,
                           }: FormLayoutProps) {
    return (
        <main className="min-h-[100dvh] flex items-center justify-center">
            <div
                className="w-full bg-surface-page max-w-[480px] flex flex-col justify-center flex-1 self-stretch px-4 py-x3l-mobile">
                {/* Top Section */}
                <div className="pt-x4l-mobile pb-20">
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <img src="/Logo.svg" alt="Bizongo" className="h-7 w-8"/>
                        <p className="text-body-lg-mobile text-text-primary">Freight Fox</p>
                    </div>
                    <h1 className="text-h6-mobile text-text-primary capitalize">
                        {title}
                    </h1>
                </div>

                {/* Dynamic Input Section */}
                <div className="w-full flex flex-col flex-1 justify-between">
                    {children}
                </div>

                {/* CTA + TnC */}
                <div className="w-full pt-2">
                    <p className="text-text-tertiary font-caption-lg-mobile mt-lg-mobile">
                        By continuing, you agree to Bizongo's{" "}
                        <a
                            href="https://www.bizongo.com/terms-and-conditions"
                            className="underline text-text-action"
                        >
                            Terms & Conditions
                        </a>
                        .
                    </p>
                </div>
            </div>
        </main>
    )
}
