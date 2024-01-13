import { useState } from "react"
import ReactDOM from "react-dom"
import { useSelector } from "react-redux"
import store from "../../store/index"
import chatSlice from "../../store/chat"
import SimpleConfirm from "../utils/SimpleConfirm"
import SimpleInput from "../utils/SimpleInput"
import AvailableChannels from "./AvailableChannels"
import styles from "./Chat.module.css"
import DmDisplay from "./PrivateMessage"


const JoinedItem = props => {
  const userData = useSelector(state => state.user)

  const [open, setOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [canChangePassword, setCanChangePassword] = useState(false)

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

  const handleChangePassword = newPassword => {
    props.changePassword(props.channel.id, newPassword)
    setCanChangePassword(false)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setCanChangePassword(false)
    setIsOwner(false)
  }

  const showConfirmModal = () => {
    if (props.channel.owner.id === userData.id) {
      setIsOwner(true)
    }
    setOpen(true)
  }

  const showChangePasswordModal = () => {
    if (props.channel.owner.id === userData.id) {
      setCanChangePassword(true)
      setOpen(true)
    }
  }

  let title = `Are you sure you want to leave ${props.channel.name}?`
  let content = ""
  if (isOwner) {
    content = `If you leave, the channel will be deleted. Continue?`
  }
  if (canChangePassword) {
    title = "Please, enter a new Password"
  }


  return (
    <>
      <li  onClick={handleClick}>
        <div >{props.channel.name}</div>
        <div >
          {
            <button onClick={showConfirmModal}>
              LeaveChannel
            </button>
          }
          {(props.channel.password !== '' && props.channel.owner.id === userData.id)? (
            <button onClick={showChangePasswordModal}>
              Change Password
              </button>
          ) : null}
        </div>
      </li>
      {open && !canChangePassword && (
        <SimpleConfirm
          onConfirm={handleOk}
          onCancel={handleCancel}
          title={title}
          content={content}
        />
      )}
      {open && canChangePassword && (
        <SimpleInput
          onConfirm={handleChangePassword}
          onCancel={handleCancel}
          title={title}
          content={content}
          name="Password"
        />
      )}
    </>
  )
}



const JoinedDisplay = props => {
  let content = <p>Join a Channel to start chating!</p>
  if (props.channels !== undefined && props.channels.length > 0) {
    content = props.channels.map(channel => (
      <JoinedItem
        key={channel.id}
        channel={channel}
        deleteChannel={props.deleteChannel}
        leaveChannel={props.leaveChannel}
        changePassword={props.changePassword}
        handleselectedChat={props.handleselectedChat}
      ></JoinedItem>
    ))
  }

  return (
    <div>
      <ul>{content}</ul>
    </div>
  )
}



const ChannelList = props => {
    const userData = useSelector(state => state.user)
    let allUserChan = []
    let myDms = []
    let joinedButNotDms = []
    let notJoinedChan = []
    let notJoinedAndNotDms = []

  
    if (props.allChan.length !== 0) {
      allUserChan = props.allChan.filter(chan =>
        chan.members.some(user => user.id === userData.id)
      )
  
      notJoinedChan = props.allChan.filter(chan =>
        chan.members.every(user => user.id !== userData.id)
      )
  
      const myNickname = userData.username
  
      const changeName = channel => {
        const name = channel.name
        const nameArray = name.split(" & ")
        const index = nameArray.indexOf(myNickname)
        if (index === 0) channel.name = nameArray[1]
        else channel.name = nameArray[0]
      }
  
      myDms = allUserChan
        .filter(channel => channel.type === 'direct')
        .map(channel => {
          changeName(channel)
          return channel
        })
  
      joinedButNotDms = allUserChan.filter(
        channel => channel.type !== 'direct'
      )
  
      notJoinedAndNotDms = notJoinedChan.filter(
        channel => channel.type !== 'direct'
      )
    }
  
    return (
      <div>
        <div >
          <h2> Joined Channels </h2>
          <JoinedDisplay
            channels={joinedButNotDms}
            deleteChannel={props.deleteChannel}
            leaveChannel={props.leaveChannel}
            changePassword={props.changePassword}
            handleselectedChat={props.handleselectedChat}
          ></JoinedDisplay>
        </div>
        <div >
          <h2> Available Channels </h2>
          <AvailableChannels
            channels={notJoinedAndNotDms}
            joinChannel={props.joinChannel}
          ></AvailableChannels>
        </div>
        <div >
          <h2> Direct Messages </h2>
          <DmDisplay
                    channels={myDms}
                    deleteChannel={props.deleteChannel}
                    leaveChannel={props.leaveChannel}
                    handleselectedChat={props.handleselectedChat}
          ></DmDisplay>
        </div>
      </div>
    )
  }
  

const NewChannel = ({ handleCreation }) => {
    const [open, setOpen] = useState(false)
  
    const onCreate = values => {
      setOpen(false)
      handleCreation(values)
    }
  
    return (
      <>
        <div >
          <button
            onClick={() => {
              setOpen(true)
            }}
          >
            New channel
          </button>
        </div>
        {open && (
          <NewChannelForm onCreate={onCreate} onCancel={() => setOpen(false)} />
        )}
      </>
    )
  }
  

  const Form = props => {
    const [inputChannelValue, setInputChannelValue] = useState("")
    const [inputPasswordValue, setInputPasswordValue] = useState("")
    const [channelType, setChannelType] = useState("public")
    const [channelErrorMessage, setChannelErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const userData = useSelector(state => state.user)
  
    const handleChannelInputChange = event => {
      setInputChannelValue(event.target.value)
    }
    const handlePasswordInputChange = event => {
      setInputPasswordValue(event.target.value)
    }
  
    const onOk = () => {
      const isValid = checkInputValues()
      if (isValid) {
        const newChannel = {
          ownerId: userData.id,
          name: inputChannelValue.trim(),
          type: channelType,
          password: inputPasswordValue.trim()
        }
        props.onCreate(newChannel)
        setInputChannelValue("")
        setInputPasswordValue("")
      }
    }
  
  
    const inputNotEmpty = () => {
      if (channelType === "public") {
        if (inputChannelValue.trim() === "") {
          setChannelErrorMessage("Channel name is required")
          return false
        }
        return true
      }
      if (channelType === "private") {
        if (inputChannelValue.trim() === "") {
          setChannelErrorMessage("Channel name is required")
          return false
        }
        setChannelErrorMessage("")
        if (inputPasswordValue.trim() === "") {
          setPasswordErrorMessage("Password is required")
          return false
        }
      }
      return true
    }
  
    const checkInputValues = () => {
      if (inputNotEmpty()) {
        return true
      }
      return false
    }
  
    return (
      <div>
        <header >
          <h4>Create new Channel</h4>
        </header>
        <div >
          <input
            type="text"
            onChange={handleChannelInputChange}
            placeholder="Enter Channel name"
            autoComplete="off"
          />
          {channelErrorMessage !== "" && (
            <p >{channelErrorMessage}</p>
          )}
        </div>
        <div >
          <input
            type="radio"
            value="public"
            checked={channelType === "public"}
            onChange={() => setChannelType("public")}
          />
          Public
          <input
            type="radio"
            name="channelType"
            value="private"
            checked={channelType === "private"}
            onChange={() => setChannelType("private")}
          />
          Private
        </div>
        {/* {channelType === "private" && ( */}
          <div >
            <input
              type="text"
              onChange={handlePasswordInputChange}
              placeholder="Enter Channel password"
              autoComplete="off"
            />
            {passwordErrorMessage !== "" && (
              <p >{passwordErrorMessage}</p>
            )}
          </div>
        {/* )} */}
        <div >
          <button  type="button" onClick={onOk}>
            Create
          </button>
          <button  onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }
  

  const NewChannelForm = props => {
    return (
      <>
        {ReactDOM.createPortal(
          <Form onCreate={props.onCreate} onCancel={props.onCancel} />,
          document.getElementById("modal")
        )}
      </>
    )
  }

const ChannelInterface = props => {
  return (
    <div className={styles.column1}>
      <NewChannel handleCreation={props.handleCreation} />
      <ChannelList
        allChan={props.channels}
        deleteChannel={props.deleteChannel}
        leaveChannel={props.leaveChannel}
        joinChannel={props.joinChannel}
        changePassword={props.changePassword}
        handleselectedChat={props.handleselectedChat}
      ></ChannelList>
    </div>
  )
}

export default ChannelInterface
