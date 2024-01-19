import styles from "./FriendList.module.css"
import Friend from "./Friend"
import Avatar from "../../assets/avatar.jpeg";

const FriendList = ({ friendList }) => {
  return (
    <div className={styles.container}>
      <h3>Friend list</h3>
      <div className={styles.list}>
        {friendList.acceptedConnections.map(friend => {
          const user = friend.user || friend.friend
          return (
            <Friend
              key={friend.id}
              id={friend.id}
              nickname={user?.username}
              avatarUrl={user?.avatar ? user.avatar : Avatar}
              status={user?.status}
              isPending={friend.isPending}
              createdByMe={friend.createdBy?.id === friendList.userId}
            />
          )
        })}
      </div>
      <h3>Pending acceptance</h3>
      <div className={styles.list}>
        {friendList.pendingConnections.map(FriendshipRequests => {
          const user = FriendshipRequests.user || FriendshipRequests.friend
          return (
            <Friend
              key={FriendshipRequests.id}
              id={FriendshipRequests.id}
              nickname={user?.username}
              avatarUrl={user?.avatar ? user.avatar : Avatar}
              status={user?.status}
              isPending={FriendshipRequests.isPending}
              createdByMe={FriendshipRequests.createdBy?.id === friendList.userId}
            />
          )
        })}
      </div>
    </div>
  )
}

export default FriendList
