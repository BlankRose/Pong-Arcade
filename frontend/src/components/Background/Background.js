//Background de fond 

import React from 'react';
import styled, { keyframes } from 'styled-components';

const animated = keyframes`
    0% {
        transform: translateY(0) rotate(45deg);
        filter: brightness(1); 
        opacity: 0.7;
    }
    50%{
        filter: brightness(1.5);
    }
    100% {
        transform: translateY(1000px) rotate(45deg);
        filter: brightness(1);
        opacity: 0;
    }
`;

const Square = styled.li`
    position: absolute;
    list-style: none;
    background-color: #C4D9E8;
    animation: ${animated} 20s linear infinite;
    bottom: 100%;
`;

const Background = styled.ul`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(#FFFFFF, #E1DDDD, #85AAC5, #3EA0E9, #85AAC5,  #E1DDDD, #FFFFFF);
    overflow: hidden;
`;

const BackgroundComponent = () => {
    return (
        <Background>
            <Square style={{ left: '50%', animationDuration: '10s', width: '100px', height: '100px', animationDelay: '1s' }} />
            <Square style={{ left: '25%', animationDuration: '12s', width: '50px', height: '50px', animationDelay: '2s' }} />
            <Square style={{ left: '40%', animationDuration: '13s', width: '40px', height: '40px', animationDelay: '0s' }} />
            <Square style={{ left: '60%', animationDuration: '11s', width: '75px', height: '75px', animationDelay: '1s' }} />
            <Square style={{ left: '10%', animationDuration: '11s', width: '90px', height: '90px', animationDelay: '1s' }} />
            <Square style={{ left: '75%', animationDuration: '14s', width: '70px', height: '70px', animationDelay: '2s' }} />
            <Square style={{ left: '90%', animationDuration: '12s', width: '30px', height: '30px', animationDelay: '0s' }} />
        </Background>
    );
};

export default BackgroundComponent;