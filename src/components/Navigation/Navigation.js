import React from 'react';
import './Navigation.css';

const Navigation = ({onRouteChange, isSignedIn}) => {
           
    if (isSignedIn) {
        return (
            <nav>
            <p className="f3 link dim black underline pa3 pointer"
                onClick={() => onRouteChange('signin')}>Sign out</p>
            </nav>
        );
    } else {
        return (
            <nav>
            <p className="f3 link dim black underline pa3 pointer"
                onClick={() => onRouteChange('signin')}>Sign In</p>
                <p className="f3 link dim black underline pa3 pointer"
                onClick={() => onRouteChange('register')}>Register</p>
            </nav>
        );
    }
}

export default Navigation;