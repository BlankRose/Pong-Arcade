import ReactDOM from "react-dom"


const ConfirmModal = props => {
  return (
    <div >
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
    </div>
  )
}

const SimpleConfirm = props => {
  return (
    <>
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
