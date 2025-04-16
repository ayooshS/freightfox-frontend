# 🔐 Auth Flow

This branch implements phone number login with OTP verification.

## Components

- `Phone_input.tsx`
- `OtpInputForm.tsx`

## Flow

1. User enters phone number
2. Validation enables Continue button
3. OTP screen appears (masked number)
4. User enters 4-digit OTP
5. On success → redirected to dashboard

## TODO

- Integrate backend OTP endpoints
- Add loading states and error handling
