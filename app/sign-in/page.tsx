import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

type Props = {}

const SignIn = (props: Props) => {
    const provider = new GoogleAuthProvider();

    const handleSignIn = () => {
        signInWithPopup(getAuth(), provider);
    }

    return (
        <div onClick={handleSignIn}>SignIn</div>
    )
}

export default SignIn