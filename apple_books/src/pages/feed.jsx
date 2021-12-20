import React from 'react';
import Pusher from 'pusher-js';
import {DataTreeView} from '../components/dataTreeView';
import {REACT_APP_PUSHER_KEY} from '../hooks/constants';
import '../styles.css';

window.sessionStorage.setItem("feed", '[]');

export default function Feed() {
  const pusher = new Pusher(REACT_APP_PUSHER_KEY, {
    cluster: 'us3'
  });

  const storedReviews = JSON.parse(window.sessionStorage.getItem("feed")) || [];
  const [reviews, setReviews] = React.useState(storedReviews);

  let channel = pusher.subscribe('my-channel');
  channel.bind('reviews', function(review) {
    let newReviews = reviews.slice() || [];
    newReviews.push(review);
    newReviews = [...new Set(newReviews)];
    setReviews(newReviews);
  });

  React.useEffect(() => {
    window.sessionStorage.setItem("feed", JSON.stringify(reviews));
  }, [reviews]);
  
  const TreeReviews = () => reviews.map(
    (review, index) => <DataTreeView key={index} data={review} mainType='review'/>
  );

  return (
    <div className='center'>
      <TreeReviews/>
    </div>
  );
}