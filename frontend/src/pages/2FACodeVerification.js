import CodeValidation from "../components/2FA/CodeVerification";
import React from 'react'
import {apiBaseURL} from "../components/API_Access";

const TFACodeVerification = () => {
    const url = `${apiBaseURL}/auth/2fa/authenticate`

    return (
        <div>
            <CodeValidation url={url} logOutButton={true}/>
        </div>
    )
}

export default TFACodeVerification