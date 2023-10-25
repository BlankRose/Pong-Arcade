import GenerateQRCode from '../components/2FA/GenerateQRCode'
import CodeValidation  from '../components/2FA/CodeVerification'
import React from 'react'


const _2FATurnOn = () => {
    const url = ''

    return (
        <div>
            <GenerateQRCode/>
            <CodeValidation url={url} logOutButton={false}/>
        </div>
    )
}


