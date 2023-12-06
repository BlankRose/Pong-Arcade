import { Link } from "react-router-dom";
import '../styles/Home.css';
import Pong from '../assets/Pong.png';

function Home() {
    return(
        <div className="home">
            <h1 className = "title">Welcome to FT_transcendence</h1>
            <div className = "description">
                <h2 className="subtitle"> Description:</h2>

                <img src={Pong} alt='pong' className="img-pong" />
                <p>
                Pong is a table tennis-themed twitch arcade sports video game, featuring simple two-dimensional graphics, 
                manufactured by Atari and originally released on November 29, 1972. It was one of the earliest arcade video games; 
                it was created by Allan Alcorn as a training exercise assigned to him by Atari co-founder Nolan Bushnell, 
                but Bushnell and Atari co-founder Ted Dabney were surprised by the quality of Alcorn's work and decided to 
                manufacture the game. Bushnell based the game's concept on an electronic ping-pong game included in the Magnavox Odyssey, 
                the first home video game console. In response, Magnavox later sued Atari for patent infringement.
                </p>
                <p>Source:  <Link to={"https://en.wikipedia.org/wiki/Pong"} className='link'> Wikipedia</Link></p>
            </div>


        <h3 className = "title-creators">Created by:</h3>
            <div className = "creators">
                <Link to={'https://github.com/BlankRose'} className='link'>Rosie</Link>
                <Link to={'https://github.com/wpf68'} className='link'>Pascal</Link>
                <Link to={'https://github.com/zkansoun'} className='link'>Zahraa</Link>
                <Link to={'https://github.com/ulookme'} className='link'>Charles</Link>
                <Link to={'https://github.com/Skellax'} className='link'>Maxime</Link>                
            </div>           
        </div>
    )
}

export default Home