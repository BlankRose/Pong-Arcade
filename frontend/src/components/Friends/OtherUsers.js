import styles from "./OtherUsers.module.css"
import { useState } from "react"
import apiHandle from "../API_Access"
import { withAuth } from "../API_Access"

const OtherUser = ({ id, nickname, avatarUrl }) => {
  const profilePictureStyle = {
    backgroundImage: `url(${avatarUrl})`,
    backgroundSize: "cover"
  }

  const [successfullyDone, setSuccessfullyDone] = useState(false)

  const sendFriendRequest = async id => {
    apiHandle
      .post(`/friend/create/${id}`, {}, withAuth())
      .then(res => {
        setSuccessfullyDone(true)
      })
      .catch(err => {
        console.warn(err.response)
      })
  }

  return (
    <div className={styles.container}>
      {!successfullyDone && (
        <>
          <div>
            <button onClick={() => sendFriendRequest(id)}>
              add
            </button>
          </div>
          <div
            className={styles.profilePicture}
            style={profilePictureStyle}
          ></div>
          <div className={styles.nameAndStatus}>
              <h3>{nickname}</h3>
          </div>
        </>
      )}
    </div>
  )
}

export default OtherUser
