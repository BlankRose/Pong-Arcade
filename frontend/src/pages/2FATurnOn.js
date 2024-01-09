import GenerateQRCode from '../components/2FA/GenerateQRCode';
import CodeValidation  from '../components/2FA/CodeVerification';
import React from 'react';
import { apiBaseURL } from "../components/API_Access";

const TFATurnOn = () => {
    const url = `${apiBaseURL}/auth/2fa/turn-on`

    return (
        <div>
            <GenerateQRCode/>
            <CodeValidation url={url} logOutButton={false}/>
        </div>
    )
}

export default TFATurnOn
