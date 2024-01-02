import { useState } from "react"
import chatSlice from "../../store/chat"
import SimpleConfirm from "../utils/SimpleConfirm"
import { useSelector } from "react-redux"
import store from "../../store/index"

const DmItem = props => {
  const userData = useSelector(state => state.user)

  const [open, setOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const handleClick = () => {
    store.dispatch(chatSlice.actions.selectChat(props.channel.id))
    store.dispatch(chatSlice.actions.selectChatName(props.channel.name))
    props.handleselectedChat(props.channel.id)
  }

  const handleOk = () => {
    setOpen(false)
    setIsOwner(false)
    setTimeout(() => {
      if (isOwner) {
        props.deleteChannel(props.channel.id)
      } else {
        props.leaveChannel(props.channel.id)
      }
    }, 300)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const showModal = () => {
    if (props.channel.owner.id === userData.id) {
      setIsOwner(true)
    }
    setOpen(true)
  }

  let title = `Are you sure you want to leave ${props.channel.name}?`
  let content = ""
  if (isOwner) {
    content = `If you leave, the channel will be deleted. Continue?`
  }



  return (
    <>
      <li onClick={handleClick}>
        <div >{props.channel.name}</div>
        <div >
            <button onClick={showModal}>
                LeaveChannel
            </button>
        </div>
      </li>
      {open && (
        <SimpleConfirm
          onConfirm={handleOk}
          onCancel={handleCancel}
          title={title}
          content={content}
        />
      )}
    </>
  )
}



const DmDisplay = props => {
  let content = <p>No dm for now</p>
  if (props.channels !== undefined && props.channels.length > 0) {
    content = props.channels.map(channel => (
      <DmItem
        key={channel.id}
        channel={channel}
        deleteChannel={props.deleteChannel}
        leaveChannel={props.leaveChannel}
        handleselectedChat={props.handleselectedChat}
      ></DmItem>
    ))
  }

  return (
    <div>
      <ul>{content}</ul>
    </div>
  )
}

export default DmDisplay
