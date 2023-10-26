import GenerateQRCode from '../components/2FA/GenerateQRCode'
import CodeValidation  from '../components/2FA/CodeVerification'
import React from 'react'

const api_port = process.env.PI_ACCESS_PORT

const _2FATurnOn = () => {
    const url = `http://localhost:${api_port}/auth/2fa/turn-on`

    return (
        <div>
            <GenerateQRCode/>
            <CodeValidation url={url} logOutButton={false}/>
        </div>
    )
}


