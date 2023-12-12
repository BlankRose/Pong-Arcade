import {useEffect, useState} from "react";
import Avatar from "../assets/avatar.jpeg";
import apiHandle, {withAuth} from "./API_Access";

const PlayerDisplay = ({player, side}) => {
	const [username, setUsername] = useState('???');
	const [avatar, setAvatar] = useState(Avatar);

	useEffect(() => {
		if (!player)
			return;
		setUsername(player.username);
		apiHandle(`/users/${player.username}`, withAuth())
			.then(res => res.data?.avatar ? setAvatar(res.data.avatar) : {})
			.catch(_ => setAvatar(Avatar));
	}, [player])

	return (<>
		{side ? <div className='players-name'>{username}</div> : <></>}
		<img className='players-icon' src={avatar} alt='avatar'></img>
		{!side ? <div className='players-name'>{username}</div> : <></>}
	</>);
}

export default PlayerDisplay