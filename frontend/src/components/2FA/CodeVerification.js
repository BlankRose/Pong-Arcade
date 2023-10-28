import { useState } from "react"
import React from "react"

const CodeValidation = ({ url, logOutButton }) => {
  const [ProvidedCode, setProvidedCode] = useState(["", "", "", "", "", ""])
  const [errorMessage, setErrorMessage] = useState("")

  const handleVerificationCodeChange = (event, index) => {
    const newCode = [...ProvidedCode]
    newCode[index] = event.target.value
    setProvidedCode(newCode)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const code = ProvidedCode.join("")
    console.log("**********88", code)
    const body = JSON.stringify({ twoFactorAuthenticationCode: code })
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: body,
        credentials: "include"
      })

      const data = await response.json()

      if (
        data.error === "Unauthorized" &&
        data.message === "Wrong authentication code"
      )
        setErrorMessage("Wrong Code")
      else if (
        data.error === "Forbidden" &&
        data.message === "Forbidden resource"
      )
        console.log(
          "Forbidden resource: you should not be trying this. You will be reported."
        )
      else {
        setErrorMessage("")
        // window.location.href = "http://localhost:5500/game"
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClear = () => {
    setProvidedCode(["", "", "", "", "", ""])
    setErrorMessage("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span>Two Factor Authentication</span>
        <p>
          Enter the twofactor authentication code displayed on the google
          authenticator application
        </p>
      </div>

      <div>
        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[0]}
          onChange={event => handleVerificationCodeChange(event, 0)}
        />

        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[1]}
          onChange={event => handleVerificationCodeChange(event, 1)}
        />

        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[2]}
          onChange={event => handleVerificationCodeChange(event, 2)}
        />

        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[3]}
          onChange={event => handleVerificationCodeChange(event, 3)}
        />

        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[4]}
          onChange={event => handleVerificationCodeChange(event, 4)}
        />

        <input
          maxLength={1}
          type="tel"
          placeholder=""
          value={ProvidedCode[5]}
          onChange={event => handleVerificationCodeChange(event, 5)}
        />
      </div>
      <p>{errorMessage}</p>
      <div>
        <button type="submit">Submit</button>
        <a href="#" onClick={handleClear}>
          Clear
        </a>
      </div>
    </form>
  )
}

export default CodeValidation
