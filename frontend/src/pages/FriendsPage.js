import styles from "./FriendsPage.module.css"
import FriendList from "../components/Friends/FriendList"
import apiHandle from "../components/API_Access"
import { withAuth } from "../components/API_Access"
import { useEffect, useState } from "react"
import AddFriendsBtn from "../components/Friends/AddFriendsBtn"

const FriendsPage = () => {
  const [friendList, setFriendList] = useState({
    userId: 0,
    acceptedConnections: [],
    pendingConnections: []
  })

  const [otherUsers, setOtherUsers] = useState({
    usersNotFriends: []
  })

  const refreshTime = 3000

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      apiHandle
        .get("users/me/getFriendsAndRequests", withAuth())
        .then(res => {
            const { userId, acceptedConnections, pendingConnections } = res.data
          setFriendList({
            userId,
            acceptedConnections,
            pendingConnections
          })
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
        })
    }

    fetchFriends() 
    const intervalId = setInterval(fetchFriends, refreshTime) 
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchOtherUsers = async () => {
      apiHandle
        .get("users/me/getallnonfriendusers", withAuth())
        .then(res => {
          const { usersNotFriends } = res.data

          setOtherUsers({
            usersNotFriends
          })
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
        })
    }

    fetchOtherUsers()
    const intervalId = setInterval(fetchOtherUsers, refreshTime)
    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className={styles.container}>
        <h1>Friends</h1>
        <div className={styles.body}>
          <div className={styles.bodyLeftSide}>
            <AddFriendsBtn otherUsers={otherUsers} />
          </div>
          <div className={styles.bodyRightSide}>
            <FriendList friendList={friendList} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
