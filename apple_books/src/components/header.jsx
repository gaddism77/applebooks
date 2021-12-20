import React from 'react';
import {Link} from 'react-router-dom';
import {HeaderContext} from '../hooks/headerContext';
import '../styles.css';

export const Header = () => {
  const { setUsername, username } = React.useContext(HeaderContext);
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setUsername(event.target.value);
    }
  }

  const handleClick = () => {
    setUsername(undefined);
  }

  const UsernameField = () => {
    if (username) {
      return (
        <div>
          <div> Hello {username} !</div>
          <div><button onClick={handleClick}>Exit...</button></div>
        </div>
      );
    }

    return (
      <div>
        <div>Please enter your username...</div>
        <label>Username: </label>
        <input type="text" onKeyDown={handleKeyDown}/>
      </div>
    );
  }

  return (
    <div className='header'>
      <UsernameField/>
      <div>
          <Link className='span' to='/books'>List of books</Link>
          <Link className='span' to='/reviews'>My Reviews</Link>
          <Link className='span' to='/feed'>Reviews Feed</Link>
      </div>
    </div>
  );
}