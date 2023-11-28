import '../styles/Footer.css'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="footer">
            <h3 className = "title">Created by:</h3>

            <div className = "creators">
                <Link to={'https://profile.intra.42.fr/users/flcollar'} className='link'>flcollar</Link>
                <Link to={'https://profile.intra.42.fr/users/pwolff'} className='link'>pwolff</Link>
                <Link to={'https://profile.intra.42.fr/users/mfuhrman'} className='link'>mfuhrman</Link>
                <Link to={'https://profile.intra.42.fr/users/chajjar'} className='link'>chajjar</Link>
                <Link to={'https://profile.intra.42.fr/users/zkansoun'} className='link'>zkansoun</Link>
            </div>           
        </div>
    )
}

export default Footer; 