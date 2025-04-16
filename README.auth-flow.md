# 🔐 Auth Flow – FreightFox

This feature branch implements the phone number login + OTP verification flow for the FreightFox MVP.

---

## ✨ What's Included

- Phone number input with validation
- OTP input using ShadCN UI components
- Country code selector (currently fixed to `+91`)
- Dynamic button states (disabled, loading)
- Masked number display during OTP entry
- Navigation on OTP submit

---

## 📁 Components

| File                  | Description                            |
|-----------------------|----------------------------------------|
| `Phone_input.tsx`     | Input field for phone number with validation and CTA |
| `OtpInputForm.tsx`    | 4-digit OTP input and masked number UI |

---

## 🔄 Flow Overview

```mermaid
graph TD
A[Phone Input Page] --> B[User enters 10-digit number]
B --> C{Is valid?}
C -- No --> D[Disable Continue]
C -- Yes --> E[Enable Continue]
E --> F[Show OTP Input]
F --> G[User enters 4-digit OTP]
G --> H[Verify and Redirect]
