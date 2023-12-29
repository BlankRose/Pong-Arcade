import styles from "./Friend.module.css"
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


  console.log("iscreatedby me: ", createdByMe)
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
          <div
            className={styles.profilePicture}
          ></div>
          <div className={styles.nameAndStatus}> 
              <h3>{nickname}</h3>
            <p>{status}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default Friend