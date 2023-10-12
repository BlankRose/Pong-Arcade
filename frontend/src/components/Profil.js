import React, {useEffect,useState} from "react";
import axios from 'axios'
import API_Access from './API_Access';
import { apiBaseURL } from './API_Access';

const Profil = () => {
    const fetchUser = async () => {
        try {
            const reponse = await axios.get(`http://localhost:5001/users`)
            const user = reponse.data;
        } catch (error) {
            console.log('error');
        }

    };

    const [user, setUser] = useState([]);

    useEffect(() => {
        fetchUser().then((user) => {
            setUser(user)
        })
    }, [])

    return (
        <div>
            <ul>
                {user.map((item) => (
                    <li key={user.id}>Pseudo: {user.username}</li>
                ))
                }
            </ul>
        </div>
    );
};

export default Profil