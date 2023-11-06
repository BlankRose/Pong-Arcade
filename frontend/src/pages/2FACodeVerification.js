import CodeValidation from "../components/2FA/CodeVerification";
import React from 'react'

const TFACodeVerification = () => {
    const url = 'http://localhost:5501/auth/2fa/authenticate'

    return (
        <div>
            <CodeValidation url={url} logOutButton={true}/>
        </div>
    )
}

export default TFACodeVerification