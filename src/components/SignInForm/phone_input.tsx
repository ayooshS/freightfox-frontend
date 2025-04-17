// src/components/SignInForm/phone_input.tsx
import {Input} from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import React, {useState} from "react"
import {Button} from "@/components/ui/button.tsx";

type PhoneInputProps = {
    value: string;
    setValue: (val: string) => void;
    onContinue: () => void;
};


export function Phone_input({value, setValue, onContinue}: PhoneInputProps) {

    const [isContinueEnabled, setIsContinueEnabled] = useState(false)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        setValue(onlyNumbers);
        setIsContinueEnabled(onlyNumbers.length === 10);
    };


    const onLogin = () => {
        onContinue()
    }

    return (

        <div className="w-full flex flex-col flex-1 justify-between">

            <div
                className="self-stretch inline-flex flex-col justify-center items-start gap-sm-mobile w-full px-sm-mobile py-sm-mobile">
                <div className="self-stretch justify-start">
                    <span className="text-text-primary font-body-base-mobile">Continue with </span>
                    <span className="text-text-primary font-body-base-mobile font-bold">phone number</span>
                </div>

                <div className="flex items-start gap-md-mobile w-full">
                    <Select defaultValue="+91">
                        <SelectTrigger size="lg" variant="outline">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        value={value}
                        onChange={handleChange}
                        error={value.length > 0 && value.length !== 10}
                        errorMessage="Please enter a valid phone number"
                        size="lg"
                        variant="outline"
                        type="tel"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={10}

                        placeholder="Eg. 1234567890"
                    />
                </div>

            </div>
            <div className="w-full">
                <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={onLogin}
                    disabled={!isContinueEnabled}
                >
                    Continue
                </Button>
            </div>
        </div>


    )
}
