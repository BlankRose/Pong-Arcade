import { useState } from "react"
import { useSelector } from "react-redux"
import SimpleConfirm from "../utils/SimpleConfirm"
import SimpleInput from "../utils/SimpleInput"

const ChannelItems = props => {
  const [open, setOpen] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const currentChatSelected = useSelector(
    state => state.chat.currentChatSelected
  )

  const showModal = () => {
    if (props.channel.type === 'private') {
      setShowInput(true)
    }
    setOpen(true)
  }

  const handleJoiningDemand = password => {
    setOpen(false)
    setShowInput(false)
    setTimeout(() => {
        console.log("titi1")
        props.joinChannel(props.channel.id, password)
    }, 300)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleEnteredPassword = password => {
    handleJoiningDemand(password)
  }

  const handleNoPassword = () => {
    handleJoiningDemand("")
  }

  let title = `Do you want to join ${props.channel.name}??`
  let content = ""
  if (showInput) {
    content = "Please, enter the Password"
  }



  return (
    <>
      <li  onClick={showModal}>
        <div >{props.channel.name}</div>
        <div >
          {/* {props.channel.type === ChannelType.Private ? (
            <img
              src={IconPrivate}
              alt="Private Channel"
            />
          ) : null} */}
        </div>
      </li>
      {open && !showInput && (
        <SimpleConfirm
          onConfirm={handleNoPassword}
          onCancel={handleCancel}
          title={title}
          content={content}
        />
      )}
      {open && showInput && (
        <SimpleInput
          onConfirm={handleEnteredPassword}
          onCancel={handleCancel}
          title={title}
          content={content}
          name="Password"
        />
      )}
    </>
  )
}



const AvailableChannels = props => {
  let content = <p>No channels to discover!</p>
  if (props.channels !== undefined && props.channels.length > 0) {
    content = props.channels.map(channel => (
      <ChannelItems
        key={channel.id}
        channel={channel}
        joinChannel={props.joinChannel}
      ></ChannelItems>
    ))
  }

  return (
    <div>
      <ul>{content}</ul>
    </div>
  )
}

export default AvailableChannels
