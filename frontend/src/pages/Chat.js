import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"
import store from "../store/index"
import chatSlice from "../store/chat"
import ChannelInterface from "../components/Chat/ChannelInterface"
import ChatInterface from "../components/Chat/ChatInterface"
import styles from "./Chat.module.css"
import {apiBaseURL} from "../components/API_Access"
import MembersInfo from "../components/Chat/MembersInfo"

const ChatPage = () => {
 
    const userData = useSelector((state) => state.user)
    const [selectedChat, setSelectedChat] = useState(useSelector((state) => state.chat.selectedChat))

    const [channels, setChannels] = useState([])
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState([])
    const [updateMessages, setupdateMessages] = useState(false)
    const [socket, setSocket] = useState()
    const [blockedUsers, setBlockedUsers] = useState([])
    const [admins, setAdmins] = useState([])
    const [owner, setOwner] = useState()
    const [bannedUsers, setBannedUsers] = useState([])
    const [mutedUsers, setMutedUsers] = useState([-1,-1])
    const [isDM, setIsDM] = useState(false)
    const mutedMembers = useSelector((state) => state.chat.mutedMembers)

    useEffect(() => {
        const chatSocket = io(`${apiBaseURL}/chat`)
        if (chatSocket !== undefined) {
            setSocket(chatSocket)

            chatSocket.on('newMessage', (newMessages, channelId) => {
              if (selectedChat === channelId) {
                setMessages(newMessages)
              } else {
                getAllMsg()
              }
                
            })
            chatSocket.on('newChannel', () => {
                getAllChannels()
            })

            chatSocket.on('UpdateChatPage', () => {
              setupdateMessages(true);
              checkSelectedChat();
              // setSelectedChat(0)
              // store.dispatch(chatSlice.actions.selectChat(0))
            })

            chatSocket.on('UpdateChatPageNoReset', () => {
              setupdateMessages(true)
            })

            return () => {
                chatSocket.off('newChannel')
                chatSocket.off('newMessage')

            }
        } else {
            console.log('Failed to connect socket')
        }
        setupdateMessages(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat, updateMessages])

    useEffect(() => {
      const fetchData = () => {
        if (socket !== undefined) {
            getAllChannels()
        }
      }
      fetchData();
      // const intervalId = setInterval(fetchData, 10000);
      // return () => clearInterval(intervalId);

	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChat])

    useEffect(() => {
      const fetchData = () => {
        if (selectedChat) {
          if (!updateMessages) {
            getAllMsg();
          }
          getChUsers();
          getBlockedUsers();
          getAllChannels();
          getAllMsg();
          if (
            channels.find(
              (x) =>
                x.id === selectedChat && x.type === 'direct'
            )
          ) {
            setIsDM(true);
          } else {
            setIsDM(false);
          }
        } else {
          setMessages([]);
          setMembers([]);
          setAdmins([]);
          setBlockedUsers([]);
          setBannedUsers([]);
          setMutedUsers([]);
          store.dispatch(chatSlice.actions.setMutedMembers([]));
        }
        setupdateMessages(false);
      };
    
      fetchData();    
      // const intervalId = setInterval(fetchData, 10000);
      // return () => clearInterval(intervalId);

	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat, updateMessages, channels]); 

    useEffect(() => {
      const fetchData = () => {
        if(selectedChat) {
          getMutedUsers()
        }
        setupdateMessages(false)
      }
      fetchData();
      // const intervalId = setInterval(fetchData, 10000);
      // return () => clearInterval(intervalId);

	// eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedChat, updateMessages])

    useEffect(() => {
      const fetchData = () => {
        if(selectedChat) {
          getBlockedUsers()
        }
        setupdateMessages(false)
      }
      fetchData();
      // const intervalId = setInterval(fetchData, 10000);
      // return () => clearInterval(intervalId);

	// eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedChat, updateMessages])

    const getMutedUsers = () => {
      if (socket !== undefined) { 
        socket.emit("getMutedUsers", selectedChat, (response) => {
          store.dispatch(chatSlice.actions.setMutedMembers(response))
          setMutedUsers(response)
        })
        setupdateMessages(true)        
      }
    }

    const checkSelectedChat = () => {
      const isChatJoined = channels.some((channel) =>
         channel.members.some((member) => member.id === userData.id ) && channel.id === selectedChat
      );
      if (isChatJoined === false)
      {
         store.dispatch(chatSlice.actions.selectChat(0))
        store.dispatch(chatSlice.actions.selectChatName(""))
        setSelectedChat(0)
      }
    }
    const getAllMsg = () => {
        if (socket !== undefined) {
            socket.emit(
                'ReturnChannelMsg',
                selectedChat,
                (res) => {
                    setMessages(res)
                }
            )
        }
    }

    const sendMessage = (newMsg) => {
        if (socket !== undefined) socket.emit('HandleNewMessage', newMsg, () => {})
    }

    const createNewChannel = (channel) => {
        if (socket !== undefined) {
            socket.emit('createNewChannel', channel, (channelId) => {
                store.dispatch(chatSlice.actions.selectChat(channelId))
                store.dispatch(chatSlice.actions.selectChatName(channel.name))
                setSelectedChat(channelId)
            })
            setTimeout(() => {
                getAllChannels()
            }, 300)
        }
    }

    const getAllChannels = () => {
        if (socket !== undefined) {
            socket.emit('FetchChannels', (response) => {
                const allChannels = response
                setChannels(allChannels)
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
                store.dispatch(chatSlice.actions.selectChatName(""))
                setSelectedChat(0)
                getAllChannels()
                if (updateMessages === false){
                      setupdateMessages(true)
                    }else {

                    }
            })
        }
    }

    const handleselectedChat = (channelId) => {
      store.dispatch(chatSlice.actions.selectChat(channelId))
      setSelectedChat(channelId)
  }


    const deleteChannel = (channelId) => {
        if (socket !== undefined) {
            socket.emit('RemoveChannel', channelId, userData.id, () => {
                store.dispatch(chatSlice.actions.selectChat(0))
                store.dispatch(chatSlice.actions.selectChatName(""))
                setSelectedChat(0)
                getAllChannels()
                setupdateMessages(true)
            })
        }
    }

    const joinChannel = (channelId, password, channelName) => {
        if (socket !== undefined) {
            socket.emit('joinChannel', channelId, userData.id, password, () => {
              store.dispatch(chatSlice.actions.selectChat(channelId))
              store.dispatch(chatSlice.actions.selectChatName(channelName))
              setSelectedChat(channelId)
              getAllChannels()
                }
            )
        }
    }
    const changePassword = (channelId, password) => {
        if (socket !== undefined) {
            socket.emit(
                'changeChannelPassword',
                channelId,
                password,
                (response) => {
                    if (!response)
                        alert('Password change failed, please try again')
                }
            )
        }
    }

    const getChUsers = () => {
        if (socket !== undefined) {
            socket.emit(
                'FetchChannelMembers',
                selectedChat,
                (response) => {
                    setMembers(response.members)
                    setAdmins(response.admins)
                    setOwner(response.owner)
                    response.bannedUsers
                        ? setBannedUsers(response.bannedUsers)
                        : setBannedUsers([])
                }
            )
            setupdateMessages(true)
        }
    }

    const changeName = channelName => {
      const name = channelName
      const nameArray = name.split(" & ")
      const index = nameArray.indexOf(userData.username)
      if (index === 0) return nameArray[1]
      else return nameArray[0]
    }


    const createDM = (targetUserId) => {
        if (socket !== undefined) {
            socket.emit(
                'createDM',
                userData.id,
                targetUserId,
                (response) => {
                    if (response) {
                        setTimeout(() => {
                            getAllChannels()
                            store.dispatch(chatSlice.actions.selectChat(response.id))
                            store.dispatch(chatSlice.actions.selectChatName(changeName(response.name)))
                            setSelectedChat(response.id)
                        }, 3000)
                    }
                }
            )
        }
    }

    const blockUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit("blockMember", userData.id, targetUserId, response => {
            if (response) {
              getAllChannels()
             setupdateMessages(true)

            }
          })
        }
      }
      
    const unblockUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit("unblockMember", userData.id, targetUserId, response => {
            if (response) {
              setupdateMessages(true)
            }
          })
        }
      }

    const getBlockedUsers = () => {
      if (socket !== undefined) {
          socket.emit("getBlockedUsers", userData.id, response => {
            setBlockedUsers(response)
          })
          setupdateMessages(true)
        }
      }

      const setAdmin = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "setAdmin",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
      }
      
      const unsetAdmin = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "unsetAdmin",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
      }

      const kickUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "kickUser",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
      }
      
      const banUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "banUser",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
      }
      
      const unbanUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "unbanUser",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
      }
      
      const muteUser = targetUserId => {
        if (socket !== undefined) {
          socket.emit(
            "muteUser",
            userData.id,
            targetUserId,
            selectedChat,
            response => {
              if (response) {
                setupdateMessages(true)
              }
            }
          )
        }
        
      }
    return (
            <div className={styles.container}>
                <ChannelInterface
                    channels={channels}
                    handleCreation={handleCreation}
                    deleteChannel={deleteChannel}
                    leaveChannel={leaveChannel}
                    joinChannel={joinChannel}
                    changePassword={changePassword}
                    handleselectedChat={handleselectedChat}
                />
                {<ChatInterface
                    channels={channels}
                    selectedChat={selectedChat}
                    messages={messages}
                    sendMessage={sendMessage}
                    amImuted={mutedMembers.some(
                        (x) => x === userData.id
                    )}
                    amIbanned={bannedUsers.some(
                      (x) => x.id === userData.id
                    )}
                    amIjoined={channels.some(
                      (x) => x.id === selectedChat
                    )

                    }
                    blockedUsers={blockedUsers}
                    handleselectedChat={handleselectedChat}
                />}
                <MembersInfo
                    users={members}
                    blockedUsers={blockedUsers}
                    admins={admins}
                    owner={owner}
                    bannedUsers={bannedUsers}
                    mutedUsers={mutedUsers}
                    createDM={createDM}
                    blockUser={blockUser}
                    unblockUser={unblockUser}
                    setAdmin={setAdmin}
                    unsetAdmin={unsetAdmin}
                    kickUser={kickUser}
                    banUser={banUser}
                    unbanUser={unbanUser}
                    muteUser={muteUser}
                    isDM={isDM}
                    // handleselectedChat={handleselectedChat}
                />

            </div>
    )

}

export default ChatPage
