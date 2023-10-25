import {useEffect, useState, React} from 'react'

const GenerateQRCode = () => {
    const[isLoading, setIsLoading] = useState(true)
    const[qrCodeUrl, setQrCodeUrl] = useState<string>('')


    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(
                    '',
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                    )
                    if (!response.ok) {throw new Error ('fetch Failed: Qr_code')}
                    const data = await response.text()
                    setQrCodeUrl(data)
                    setIsLoading(false)
            }
            catch (Error){
                console.error ("Server failed to generate Qr_Code: ", Error)
            }
        }
        fetchQRCode()

    },
    []
    )

    if (isLoading){
        return <div>....Wait! w'll generate the code soon....</div>
    }

    return(
        <div>
            <h2>Please Scan the QRCode to activate two factor authentication</h2>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR_CODE"/>}
        </div>
    )
}

export default GenerateQRCode 