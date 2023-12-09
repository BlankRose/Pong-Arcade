import ReactDOM from "react-dom"
import { useState } from "react"


const Input = props => {
  const [errorMessage, setErrorMessage] = useState("")
  const [inputValue, setInputValue] = useState("")

  const inputNotEmpty = () => {
    if (inputValue.trim() === "") {
      setErrorMessage("Value is required")
      return false
    }
    return true
  }

  const checkInputValues = () => {
    if (inputNotEmpty()) {
      return true
    }
    return false
  }

  const onOk = () => {
    const isValid = checkInputValues()
    if (isValid) {
      props.onConfirm(inputValue)
      setInputValue("")
    }
  }

  const handleInputChange = event => {
    event.preventDefault()
    setInputValue(event.target.value)
  }

  return (
    <div >
      <header >
        <h4>{props.title}</h4>
      </header>
      <div >
        <input
          type="text"
          name="channelName"
          onChange={handleInputChange}
          placeholder={props.content}
          autoComplete="off"
        />
        {errorMessage !== "" && <p>{errorMessage}</p>}
      </div>
      <div >
        <button  onClick={onOk}>
          Send
        </button>
        <button  onClick={props.onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

const SimpleInput = props => {
  return (
    <>
      {ReactDOM.createPortal(
        <Input
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
          title={props.title}
          content={props.content}
          name={props.name}
        />,
        document.getElementById("modal")
      )}
    </>
  )
}

export default SimpleInput
