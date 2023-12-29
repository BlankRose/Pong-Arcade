import styles from "./MembersInfo.module.css"
import User from "./User"
import { useSelector } from "react-redux"
import { useState } from "react"

const UserBox = props => {
  const userData = useSelector(state => state.user)

  const [openMenus, setOpenMenus] = useState(0)

  const handleOpenMenu = () => {
    setOpenMenus(1)
  }

  const handleCloseMenu = () => {
    setOpenMenus(0)
  }

  return (
    <div className={`${styles.usersBox}`}>
      <h2> online </h2>
      {props.users.map(user =>
        user.status === "online" ? (
          <User
            key={user.id}
            id={user.id}
            nickname={user.username}
            avatarUrl={user.avatar}
            status={user.status}
            amIowner={props.owner.id === userData.id}
            amIadmin={props.admins.some(admin => admin.id === userData.id)}
            isOwner={props.owner.id === user.id}
            isAdmin={props.admins.some(admin => admin.id === user.id)}
            isBlocked={props.blockedUsers.some(
              blockedUser => blockedUser === user.id
            )}
            isBanned={false}
            isMuted={props.mutedUsers.some(mutedUser => mutedUser === user.id)}
            createDM={props.createDM}
            blockUser={props.blockUser}
            unblockUser={props.unblockUser}
            setAdmin={props.setAdmin}
            unsetAdmin={props.unsetAdmin}
            kickUser={props.kickUser}
            banUser={props.banUser}
            unbanUser={props.unbanUser}
            muteUser={props.muteUser}
            isDM={props.isDM}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
            openMenus={openMenus}
          />
        ) : null
      )}
      <h2> offline </h2>
      {props.users.map(user =>
        user.status === "offline" ? (
          <User
            key={user.id}
            id={user.id}
            nickname={user.username}
            avatarUrl={user.avatar}
            status={user.status}
            amIowner={props.owner.id === userData.id}
            amIadmin={props.admins.some(admin => admin.id === userData.id)}
            isOwner={props.owner.id === user.id}
            isAdmin={props.admins.some(admin => admin.id === user.id)}
            isBlocked={props.blockedUsers.some(
              blockedUser => blockedUser === user.id
            )}
            isBanned={false}
            isMuted={props.mutedUsers.some(mutedUser => mutedUser === user.id)}
            createDM={props.createDM}
            blockUser={props.blockUser}
            unblockUser={props.unblockUser}
            setAdmin={props.setAdmin}
            unsetAdmin={props.unsetAdmin}
            kickUser={props.kickUser}
            banUser={props.banUser}
            unbanUser={props.unbanUser}
            muteUser={props.muteUser}
            isDM={props.isDM}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
            openMenus={openMenus}
          />
        ) : null
      )}
      <h2> banned </h2>
      {props.bannedUsers.map(banUser => (
        <User
          key={banUser.id}
          id={banUser.id}
          nickname={banUser.username}
          avatarUrl={banUser.avatar}
          status={banUser.status}
          amIowner={props.owner.id === userData.id}
          amIadmin={props.admins.some(admin => admin.id === userData.id)}
          isOwner={props.owner.id === banUser.id}
          isAdmin={props.admins.some(admin => admin.id === banUser.id)}
          isBlocked={props.blockedUsers.some(
            blockedUser => blockedUser === banUser.id
          )}
          isBanned={true}
          isMuted={false}
          createDM={props.createDM}
          blockUser={props.blockUser}
          unblockUser={props.unblockUser}
          setAdmin={props.setAdmin}
          unsetAdmin={props.unsetAdmin}
          kickUser={props.kickUser}
          banUser={props.banUser}
          unbanUser={props.unbanUser}
          muteUser={props.muteUser}
          isDM={props.isDM}
          handleOpenMenu={handleOpenMenu}
          handleCloseMenu={handleCloseMenu}
          openMenus={openMenus}
        />
      ))}
    </div>
  )
}

export default UserBox
