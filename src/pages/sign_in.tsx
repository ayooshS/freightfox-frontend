import {FormLayout} from "@/components/SignInForm/form_layout.tsx";
import {SignInInput} from "@/components/SignInForm/sign_in_input.tsx";


function SignInPage() {


    // const isValid = phone.length === 10

    return (
        <FormLayout
            title="Login to continue"
            // Inside SignInPage.tsx
        >
            <SignInInput/>
        </FormLayout>
    )
}

export default SignInPage
