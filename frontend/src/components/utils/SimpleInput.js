import ReactDOM from "react-dom"
import { useState } from "react"
import Backdrop from "./Backdrop"
import Card from "./Card"

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
  const noLongerThanEight = () => {
    if (inputValue.trim().length > 8) {
      setErrorMessage(`${props.name} is too long (8 characters max)`)
      return false
    }
    return true
  }

  const checkInputValues = () => {
    if (inputNotEmpty() && noLongerThanEight()) {
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
    <Card >
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
    </Card>
  )
}

const SimpleInput = props => {
  return (
    <>
      {/* {ReactDOM.createPortal(<Backdrop />, document.getElementById("backdrop"))} */}
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
