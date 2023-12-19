import {useParams} from 'react-router-dom'
import Profil from './Profil'

function ProfilContainer() {
    const { username } = useParams()
    return <Profil username={username}/>
}

export default ProfilContainer;