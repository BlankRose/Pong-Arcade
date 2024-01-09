import { useEffect, useState } from "react"
import React from "react"
import {apiBaseURL} from "../API_Access";

const GenerateQRCode = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(
          `${apiBaseURL}/auth/2fa/generateQr`,
          {
            method: "GET",
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