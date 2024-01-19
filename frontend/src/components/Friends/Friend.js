import styles from "./Friend.module.css"
import { Link } from 'react-router-dom';
import { useState } from "react"
import apiHandle from "../API_Access"
import { withAuth } from "../API_Access"

const Friend = ({
  id,
  nickname,
  avatarUrl,
  status,
  isPending,
  createdByMe
}) => {


  const [successfullyDone, setSuccessfullyDone] = useState(false)

  const removeFriendship = async id => {
    apiHandle
      .delete(`/friend/delete/${id}`, withAuth())
      .then(res => {
        setSuccessfullyDone(true)
      })
      .catch(err => {
        console.warn(err.response)
      })
  }

  const acceptFriendship = async id => {
    const updateFriendDto = {
      isPending: false,
  }
    apiHandle
      .patch(`friend/accept/${id}`, updateFriendDto, withAuth())
      .then(res => {
        setSuccessfullyDone(true)
      })
      .catch(err => {
        console.warn(err.response)
      })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "online":
        return styles.online;
      case "playing":
        return styles.playing;
      default:
        return styles.offline;
    }
  };

  return (
    <div className={styles.container}>
      {!successfullyDone && (
        <>
          <div>
            {isPending && !createdByMe && (
              <button onClick={() => removeFriendship(id)}>
               remove friend
              </button>
            )}
            <button onClick={
                isPending
                  ? createdByMe
                    ? () => removeFriendship(id)
                    : () => acceptFriendship(id)
                  : () => removeFriendship(id)
              }>

               {isPending 
                  ? createdByMe 
                    ? 'Remove Friend' 
                    : 'Accept Friend' 
                  : 'Remove Friend'}
              
            </button>
          </div>
          <img
            className={styles.profilePicture} src={avatarUrl} alt="avatar"
          />
          <div className={styles.nameAndStatus}> 
				<Link className={styles.friendName} to={`/profile/${nickname}`}>{nickname}</Link>
				<p className={getStatusClass(status)}>{status}</p>              
          </div>
        </>
      )}
    </div>
  )
}

export default Friend
