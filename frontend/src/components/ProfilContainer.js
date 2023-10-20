import {useParams} from 'react-router-dom'
import Profil from './Profil'

function profilContainer() {
    const { username } = useParams()
    return <Profil username={username}/>
}

export default profilContainer