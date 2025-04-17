import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


type OtpInputFormProps = {
    value: string

}


export function OtpInputForm({value}: OtpInputFormProps) {
    const navigate = useNavigate();
    const [otpVal, setOtpVal] = useState("");

    const maskedPhone = `${"X".repeat(7)}${value.slice(-3)}`;

    const onChange = (val: string) => {
        const onlyDigits = val.replace(/[^0-9]/g, "").slice(0, 4);
        setOtpVal(onlyDigits);
    };

    const onOtpLogin = () => {
        navigate("/dashboard");
    };

    const isOtpValid = otpVal.length === 4;

    return (
        <>
            <div
                className="self-stretch inline-flex flex-col justify-center items-start gap-sm-mobile w-full px-sm-mobile py-sm-mobile">
                <p className="text-text-primary font-body-base-mobile">
                    We have sent a verification code to{" "}
                    <span className="font-bold">+91 {maskedPhone}</span>
                </p>

                <InputOTP
                    maxLength={4}
                    value={otpVal}
                    onChange={onChange}
                    containerClassName="mt-md-mobile"
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={1}/>
                        <InputOTPSlot index={2}/>
                        <InputOTPSlot index={3}/>
                    </InputOTPGroup>
                </InputOTP>

                <Button variant="link" >
                    Resend OTP in 30s
                </Button>
            </div>

            <div className="w-full">
                <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={onOtpLogin}
                    disabled={!isOtpValid}
                >
                    Login
                </Button>
            </div>
        </>
    );
}