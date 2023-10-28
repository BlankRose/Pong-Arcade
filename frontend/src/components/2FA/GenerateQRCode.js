import { useEffect, useState } from "react"
import React from "react"

const GenerateQRCode = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const api_port = process.env.PI_ACCESS_PORT

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(
          `http://localhost:5501/auth/2fa/generateQr`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        )
        if (!response.ok) {
          throw new Error("fetch Failed: Qr_code")
        }
        const data = await response.text()
        setQrCodeUrl(data)
        setIsLoading(false)
      } catch (Error) {
        console.error("Server failed to generate Qr_Code: ", Error)
      }
    }
    fetchQRCode()
  }, [])

  if (isLoading) {
    return <div>....Wait! w'll generate the code soon....</div>
  }

  return (
    <div>
      <h2>Please Scan the QRCode to activate two factor authentication</h2>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR_CODE" />}
    </div>
  )
}

export default GenerateQRCode
