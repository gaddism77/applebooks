import React from 'react';
import {HeaderContext} from '../hooks/headerContext';
import {useReviews} from '../hooks/useReviews';
import {DataTreeView} from '../components/dataTreeView';
import '../styles.css';

export default function ReviewsPage() {
  const { username } = React.useContext(HeaderContext);

  const { getReviews, loading, reviews=[], error} = useReviews();

  React.useEffect(() => {
    if (username) {
      getReviews();
    }
  }, [getReviews, username])

  if (!username) {
    return (
      <div>You need to enter your username to view results!</div>
    );
  }

  if(loading) {
    return (
      <div>Loading something awesome...</div>
    );
  }
  
  if(error) {
    return (
      <div>Ooops!</div>
    );
  }

  const TreeReviews = () => reviews.map(
    (review, index) => <DataTreeView key={index} data={review} mainType='review' username={username}/>
  );

  return (
    <div className='center'>
      <TreeReviews/>
    </div>
  );
}