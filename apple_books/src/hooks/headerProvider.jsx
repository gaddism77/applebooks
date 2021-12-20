import React from 'react';
import { HeaderContext } from './headerContext';
import { Header } from '../components/header';

export const HeaderProvider = ({children}) => {
  const [username, setUsername] = React.useState();
  // const setUsername = (user) => {
  //   window.sessionStorage.setItem("username", user);
  // };
  // const username = JSON.parse(window.sessionStorage.getItem("username"));

  return (
    <HeaderContext.Provider
      value={{
        setUsername,
        username
      }}>
      <Header />
      {children}
    </HeaderContext.Provider>
  );
}