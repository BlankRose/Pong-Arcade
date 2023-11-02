import GenerateQRCode from '../components/2FA/GenerateQRCode'
import CodeValidation  from '../components/2FA/CodeVerification'
import React from 'react'

const TFATurnOn = () => {
    const url = `http://localhost:5501/auth/2fa/turn-on`

    return (
        <div>
            <GenerateQRCode/>
            <CodeValidation url={url} logOutButton={false}/>
        </div>
    )
}

export default TFATurnOn
