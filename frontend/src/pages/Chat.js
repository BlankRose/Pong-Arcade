import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import store from "../store/index"
import {socket} from  "socket.io-client"
import chatSlice from "../store/chat"
import ChatService from "../sockets/chatSocket"
import ChannelInterface from "../components/Chat/ChannelInterface"
import ChatInterface from "../components/Chat/ChatInterface"

const ChatPage = () => {

    const userData = useSelector((state) => state.user)
    console.log("UserData", userData)
    const currentChatSelected = useSelector(
        (state) => state.chat.currentChatSelected
    ) 
    const [channels, setChannels] = useState([])
    const [messages, setMesssages] = useState([])
    const [members, setMembers] = useState([])
    const [reloadUsers, setReloadUsers] = useState(false)
    const [socket, setSocket] = useState()
    const [owner, setOwner] = useState()

    useEffect(() => {
        const newSocket = ChatService.getInstance().connect()
        console.log("socket: ", newSocket)
        if (newSocket !== undefined) {
            setSocket(newSocket)

            console.log("socket2: ", newSocket)
            newSocket.on('incomingMessages', (newMessages) => {
                setMesssages(newMessages)
            })
            newSocket.on('newChannel', () => {
                getAllChannels()
            })

            return () => {
                newSocket.off('newChannel')
                newSocket.off('incomingMessage')
            }
        } else {
            console.log('Socket not connected')
        }
    }, [])

    useEffect(() => {
        if (socket !== undefined) {
            getAllChannels()
        }
    }, [socket])

    useEffect(() => {
        if (currentChatSelected) {
            if (!reloadUsers) {
                getAllMsg()
            }
            getChUsers()
        } else {
            setMesssages([])
            setMembers([])
        }
        setReloadUsers(false)
    }, [currentChatSelected, reloadUsers])

    const getAllMsg = () => {
        if (socket !== undefined) {
            socket.emit(
                'ReturnChannelMsg',
                currentChatSelected,
                (response) => {
                    setMesssages(response)
                }
            )
        }
    }

    const sendMessage = (newMsg) => {
        if (socket !== undefined) socket.emit('SubmitMsg', newMsg, () => {})
    }

    const createNewChannel = (channel) => {
        console.log("channel: ", channel)
        if (socket !== undefined) {
            socket.emit('createNewChannel', channel, (channelId) => {
                store.dispatch(chatSlice.actions.selectChat(channelId))
            })
            setTimeout(() => {
                getAllChannels()
            }, 300)
        }
    }

    const getAllChannels = () => {
        console.log("********LiLi")
        if (socket !== undefined) {
            socket.emit('ReturnChannels', (response) => {
                console.log("********response: ", response)
                const allChannels = response
                setChannels(allChannels)
                console.log("allchannels: ", channels)
            })
        }
    }

    const handleCreation = (channel) => {
        if (socket !== undefined) createNewChannel(channel)
    }

    const leaveChannel = (channelId) => {
        if (socket !== undefined) {
            socket.emit('RemoveUserFromChannel', channelId, userData.id, () => {
                store.dispatch(chatSlice.actions.selectChat(0))
                getAllChannels()
            })
        }
    }
    const deleteChannel = (channelId) => {
        if (socket !== undefined) {
            socket.emit('RemoveChannel', channelId, userData.id, () => {
                store.dispatch(chatSlice.actions.selectChat(0))
                getAllChannels()
            })
        }
    }

    const joinChannel = (channelId, password) => {
        if (socket !== undefined) {
            socket.emit('joinChannel', channelId, userData.id, password, () => {
                    getAllChannels()
                    store.dispatch(chatSlice.actions.selectChat(channelId))
                }
            )
        }
    }
    const changePassword = (channelId, password) => {
        if (socket !== undefined) {
            socket.emit(
                'changePassword',
                channelId,
                password,
                (response) => {
                    if (!response)
                        alert('Could not change password, please try again')
                }
            )
        }
    }

    const getChUsers = () => {
        if (socket !== undefined) {
            socket.emit(
                'findUsersByChannel',
                currentChatSelected,
                (response) => {
                    setMembers(response.members)
                }
            )
        }
    }

    return (
        <div>
            <div>
                <ChannelInterface
                    channels={channels}
                    handleCreation={handleCreation}
                    deleteChannel={deleteChannel}
                    leaveChannel={leaveChannel}
                    joinChannel={joinChannel}
                    changePassword={changePassword}
                />
                <ChatInterface
                    currentChatSelected={currentChatSelected}
                    messages={messages}
                    sendMessage={sendMessage}
                />
                {/* <ConnectedUsers
                    members={members}
                    owner={owner}
                /> */}
            </div>
        </div>
    )

}

export default ChatPage