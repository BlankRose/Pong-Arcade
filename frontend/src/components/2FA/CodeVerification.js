import { useState } from "react"
import store from "../../store/index"
import authSlice from '../../store/auth'
import {webBaseURL} from "../API_Access";


const CodeValidation = ({ url, logOutButton }) => {
  const [providedCode, setProvidedCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleVerificationCodeChange = event => {
    setProvidedCode(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ ProvidedCode: providedCode })
      })

      const data = await response.json()

      if (response.ok) {
        setErrorMessage("")
    
          store.dispatch(authSlice.actions.require2FAAuth())
          store.dispatch(authSlice.actions.confirm2FAAuth(false))
          store.dispatch(authSlice.actions.require2FAAuth())

        window.location.href = `${webBaseURL}/profile`
      } else {
        const errorMessage = data.error || "An error occurred"
        setErrorMessage(errorMessage)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("An error occurred")
    }

  }

  const handleClear = () => {
    setProvidedCode("")
    setErrorMessage("")
  }

  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span>Two Factor Authentication</span>
        <p>
          Enter the two-factor authentication code displayed on the Google Authenticator application
        </p>
      </div>

      <div>
        <input
          maxLength={6}
          type="tel"
          placeholder=""
          value={providedCode}
          onChange={handleVerificationCodeChange}
          style={{
            width: '100px',
            height: '40px',
            fontSize: '1.2em',
            textAlign: 'left',
            marginRight: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      </div>
      <p>{errorMessage}</p>
      <div>
        <button type="submit">Submit</button>
        <a href="#top" onClick={handleClear}>
          Clear
        </a>
      </div>
    </form>
  )
}

export default CodeValidation