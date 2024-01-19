import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import styles from "./Chat.module.css"

const SendForm = ({ sendMessage }) => {
    const userData = useSelector(state => state.user)
    const selectedChat = useSelector(state => state.chat.selectedChat)
    const [inputText, setInputText] = useState("")
  
    const handleCreation = text => {
      const newMsg = {
        senderId: userData.id,
        content: text,
        channelId: selectedChat,
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
      <div style={{ textAlign: 'center' }}>
        <input
          placeholder="Send message"
          type="text"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id="message-input"
          autoComplete="off"
          style={{ width: '80%'}}
        />
      </div>
    )
}

const Msg = ({ msg, blockedUsers }) => {
    const userData = useSelector(state => state.user)
    const myNickname = userData.username
    const isCreatorBlocked = blockedUsers.indexOf(msg.senderId) !== -1

    return (
      <>
            {msg.username === myNickname ? (
                <div >
                    <div >
                        <p >
                            <b>{msg.username} : </b> {msg.content}
                        </p>
                    </div>
                       {/* add avatar */}
                </div>
            ) : isCreatorBlocked ? (
                <div>
                    {/* add avatar */}
                    <div >
                        <p>
                            <b>BLOCKED : </b> [...]
                        </p>
                    </div>
                </div>
            ) : (
                <div >
                    {/* add avatar */}
                    <div >
                        <p >
                            <b>{msg.username} : </b> {msg.content}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

const ChatFeed = ({ messages, blockedUsers}) => {  
  const isFeedFull = useRef(null)
  
    useEffect(() => {
      if (isFeedFull.current)
        isFeedFull.current.scrollTop = isFeedFull.current?.scrollHeight
    }, [messages])
  
    return (
      <div >
        {messages.map(msg => (
          <Msg key={msg.id} msg={msg} blockedUsers={blockedUsers} ></Msg>
        ))}
      </div>
    )
}

function ChatInterface(props) {
    const [isChatValid, /*setIsChatValid*/] = useState(true);
    const selectedChatName = useSelector(state => state.chat.chatName);
    const h1Styles = {
      fontFamily: 'Roboto', 
      textAlign: 'center',
      fontSize: '50px', 
    };
  
    const chatFeedStyles = {
      maxHeight: '1000px',
      overflowY: 'auto',
      scrollBehavior: 'auto contain', // Use camelCase for property names
      overflowX: 'hidden',
      wordBreak: 'break-all',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    };

    return (
      <div className={styles.column2}>
        {props.selectedChat > 0 && <h1 style={h1Styles}>{selectedChatName}</h1>}
        <div style={chatFeedStyles}>
        {
         props.selectedChat > 0  && isChatValid ? (
         <ChatFeed 
          messages={props.messages}
          blockedUsers={props.blockedUsers} />
         ) :
         (
          <ChatFeed 
          messages={[]}
          blockedUsers={[]} />
         )

         }
        </div>
        {
       props.selectedChat > 0 && !props.amImuted && isChatValid ? (
       <SendForm sendMessage={props.sendMessage} />
       ) : props.amImuted ? (
       <p>You're muted, select another chat</p>
       ) : null
       }
      </div>
    );
}
  

export default ChatInterface
