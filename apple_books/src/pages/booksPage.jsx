import React from 'react';
import {HeaderContext} from '../hooks/headerContext';
import {useBooks} from '../hooks/useBooks';
import {DataTreeView} from '../components/dataTreeView';
import '../styles.css';

export default function BooksPage() {
  const { username } = React.useContext(HeaderContext);
  const { getBooks, loading, books=[], error} = useBooks();
  
  React.useEffect(() => {
    getBooks();
  }, [getBooks]);

  if(loading) {
    return (
      <div>Loading something awesome!</div>
    );
  }
  
  if(error) {
    return (
      <div>Ooops!</div>
    );
  }

  const TreeBooks = () => books.map(
    (book, index) => <DataTreeView key={index} data={book} mainType='book' username={username}/>
  );

  return (
    <div className='center'>
      <TreeBooks/>
    </div>
  );
}