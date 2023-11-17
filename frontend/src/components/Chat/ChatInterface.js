import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import styles from "./Chat.module.css"


const SendForm = ({ sendMessage }) => {
    const userData = useSelector(state => state.user)
    const currentChatSelected = useSelector(
      state => state.chat.selectedChat
    )
    const [inputText, setInputText] = useState("")
  
    const handleCreation = text => {
      const newMsg = {
        senderId: userData.id,
        content: text,
        channelId: currentChatSelected,
      }
      sendMessage(newMsg)
      setInputText("")
    }
  
    const handleChange = event => {
      setInputText(event.target.value)
    }
  
    const handleKeyDown = event => {
      if (event.key === "Enter") {
        handleCreation(inputText)
      }
    }
  
    return (
      <div >
        <input
          placeholder="Send message"
          type="text"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id="message-input"
          autoComplete="off"
        />
      </div>
    )
  }


  const Msg = ({ msg, blockedUsers }) => {
    const userData = useSelector(state => state.user)
    const myNickname = userData.username
    // const isCreatorBlocked = blockedUsers.indexOf(msg.creator) !== -1
  
    return (
      <>
        {msg.userNickname === myNickname ? (
          <div >
            <div >
              <p >
                <b>{msg.userNickname} : </b> {msg.content}
              </p>
            </div>
            {/* <img
              src={msg.userAvatarUrl}
              alt="Avatar"
              className={styles.profilePicture}
            /> */}
          </div>
        ) : (
          <div >
            {/* <img
              src={msg.userAvatarUrl}
              alt="Avatar"
              className={styles.profilePicture}
            /> */}
            <div >
              <p >
                <b>{msg.userNickname} : </b> {msg.content}
              </p>
            </div>
          </div>
        )}
      </>
    )
  }
  

const ChatFeed = ({ messages}) => {
    const isFeedFull = useRef(null)
  
    useEffect(() => {
      if (isFeedFull.current)
        isFeedFull.current.scrollTop = isFeedFull.current?.scrollHeight
    }, [messages])
  
    return (
      <div >
        {messages.map(msg => (
          <Msg key={msg.id} msg={msg} ></Msg>
        ))}
      </div>
    )
  }

function ChatInterface(props) {
  return (
    <div className={styles.column2} >
      <ChatFeed messages={props.messages} />
      <SendForm sendMessage={props.sendMessage} />
    </div>
  )
}

export default ChatInterface