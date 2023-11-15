import ReactDOM from "react-dom"
import Backdrop from "./Backdrop"
import Card from "./Card"

const ConfirmModal = props => {
  return (
    <Card >
      <header >
        <h4>{props.title}</h4>
      </header>
      <div >
        <p>{props.content}</p>
      </div>
      <footer >
        <button  onClick={props.onConfirm}>
          Confirm
        </button>
        <button  onClick={props.onCancel}>
          Cancel
        </button>
      </footer>
    </Card>
  )
}

const SimpleConfirm = props => {
  return (
    <>
      {/* {ReactDOM.createPortal(<Backdrop />, document.getElementById("backdrop"))} */}
      {ReactDOM.createPortal(
        <ConfirmModal
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
          title={props.title}
          content={props.content}
        />,
        document.getElementById("modal")
      )}
    </>
  )
}

export default SimpleConfirm
