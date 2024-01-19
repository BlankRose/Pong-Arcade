import styles from "./User.module.css"
//import IconMsg from "../../assets/icon/message.svg"
//import IconInviteToPlay from "../../assets/icon/invite_to_play.svg"
//import IconBlocked from "../../assets/icon/block_user.svg"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"
import { Link } from 'react-router-dom';
//import { useNavigate } from "react-router-dom"
import Avatar from '../../assets/avatar.jpeg';

const User = ({
  id,
  nickname,
  avatarUrl,
  status,
  amIowner,
  amIadmin,
  isOwner,
  isAdmin,
  isBlocked,
  isBanned,
  isMuted,
  createDM,
  blockUser,
  unblockUser,
  setAdmin,
  unsetAdmin,
  kickUser,
  banUser,
  unbanUser,
  muteUser,
  isDM,
  handleOpenMenu,
  handleCloseMenu,
  openMenus
}) => {
  const userData = useSelector(state => state.user)
  const myId = userData.id

  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0
  })

  const handleContextMenu = event => {
    event.preventDefault()
    if (openMenus === 0) {
      handleOpenMenu()
      setShowContextMenu(true)
      setContextMenuPosition({
        x: event.clientX,
        y: event.clientY + window.scrollY
      })
    }
  }

  const handleContextMenuClose = () => {
    handleCloseMenu()
    setShowContextMenu(false)
  }

  const blockUserHandler = () => {
    blockUser(id)
  }

  const unblockUserHandler = () => {
    unblockUser(id)
  }

  let toggleBlockUser = null
  if (id !== myId) {
    toggleBlockUser = isBlocked ? (
      <li onClick={unblockUserHandler}>Unblock</li>
    ) : (
      <li onClick={blockUserHandler}>Block</li>
    )
  }

  const createDmHandler = () => {
    createDM(id)
  }

  const setAdminHandler = () => {
    setAdmin(id)
  }

  const unsetAdminHandler = () => {
    unsetAdmin(id)
  }

  const kickUserHandler = () => {
    kickUser(id)
  }

  const banUserHandler = () => {
    banUser(id)
  }

  const unbanUserHandler = () => {
    unbanUser(id)
  }

  const muteUserHandler = () => {
    muteUser(id)
  }

  const contextMenuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = event => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        handleContextMenuClose()
        handleCloseMenu()
      }
    }

    if (showContextMenu) {
      document.addEventListener("click", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showContextMenu])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src={avatarUrl? avatarUrl : Avatar}
          alt="Avatar"
          onContextMenu={id !== myId ? handleContextMenu : undefined}
        />
        {showContextMenu && (
          <div
            ref={contextMenuRef}
            className={styles.contextMenu}
            style={{
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              backgroundColor: 'white',
              width: '200px', 
            }}
            onClick={handleContextMenuClose}
          >
            <ul>
				{!isDM && !isBlocked && (
					<li onClick={createDmHandler}>Direct Message</li>
				)}
              {toggleBlockUser}
              {amIowner ? (
                <ul>
                  {isAdmin ? (
                    <li onClick={unsetAdminHandler}>Remove admin</li>
                  ) : (
                    <li onClick={setAdminHandler}>Set admin</li>
                  )}
                  {!isBanned && <li onClick={kickUserHandler}>Kick</li>}
                  {isBanned ? (
                    <li onClick={unbanUserHandler}>Unban</li>
                  ) : (
                    <li onClick={banUserHandler}>Ban</li>
                  )}
                  {!isMuted && <li onClick={muteUserHandler}>Mute</li>}                   
                </ul>
              ) : (
                amIadmin &&
                !isOwner && (
                  <ul>
                    {!isBanned && <li onClick={kickUserHandler}>Kick</li>}
                    {isBanned ? (
                      <li onClick={unbanUserHandler}>Unban</li>
                    ) : (
                      <li onClick={banUserHandler}>Ban</li>
                    )}
                    {!isMuted && <li onClick={muteUserHandler}>Mute</li>}
                  </ul>
                )
              )}
            </ul>
          </div>
        )}
        <div>
          <Link className={styles.profil} to={`../profile/${id}`}>{nickname}</Link>
          <p className={styles.status}>
            {status === "playing" ? "playing" : ""}
          </p>
        </div>
      </div>
    </div>
  )
}

export default User
