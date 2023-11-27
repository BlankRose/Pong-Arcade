import React, { useEffect, useState} from 'react';
import apiHandle, { withAuth } from './API_Access';
import '../styles/Ladder.css';
import { Link } from 'react-router-dom';

const Ladder = () => {

    const [listUser, setlistUser] = useState([]);

    const elolist = listUser.sort((a,b) => (a.elo < b.elo ? 1 : -1));

    const rankClass = (position) => {
        switch(position) {
            case 1:
                return 'first';
            case 2:
                return 'second';
            case 3: 
                return 'third';
            default:
                return 'others';
        }
    };

    useEffect(() => {
        apiHandle.get('/users/all', withAuth())
        .then(response => {
            if (response.data)
                setlistUser(response.data);
        })
        .catch(error => {
            console.error('Failed to fetched all users data', error);
        });

    }, []);

    return (
        <div className = "Container_two">
            <h1 className='ladder-title'>Leaderboard</h1>
            <br></br>
            <ul className='ladder-list'>
                {elolist.map((user, index) => (
                    <li key={user.id} position={index + 1} className='ladder'>
                        <div className='leader-user'>
                            <div className={`${rankClass(index + 1)}`}> {index === 0 ? index + 1 + 'ST': 
                                index === 1 ? index + 1 + 'ND' : 
                                index === 2 ? index + 1 + 'RD ' : 
                                index + 1 + 'TH '}
                            </div>
                            <Link className='link' to={`/profile/${user?.id}`}>{user?.username}</Link>                            <div>{user.elo}pts</div>
                        </div>
                    </li>
                ))}
                
            </ul>
        </div>
    )
}


export default Ladder;