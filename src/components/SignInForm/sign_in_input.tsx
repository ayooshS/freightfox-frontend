// src/components/SignInForm/phone_input.tsx



import {OtpInputForm} from "@/components/SignInForm/otp_input.tsx";
import {Phone_input} from "@/components/SignInForm/phone_input.tsx";
import {useState} from "react";



export function SignInInput() {
    const [showOtp, setShowOtp] = useState(false);
    const [value, setValue] = useState("")


    const onContinue = () =>{
        console.log("onContinue");
        setShowOtp(true);

    }

    return (
        <>
            {
                !showOtp ? (
                    <Phone_input value={value} setValue={setValue} onContinue={onContinue}  />
                ):(
                    <OtpInputForm value={value} />
                )
            }




        </>
    )
}
