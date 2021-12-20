import React from 'react';
import {useRest} from './useRest';
import {HeaderContext} from './headerContext';

export const useReviews = () => {
  const { username } = React.useContext(HeaderContext);
  const [{
    data: reviews=[],
    loading,
    error
  }, getReviews] = useRest({
    route: `reviews/?username=${username}`,
    method: 'GET'
  });

  const [{
    data: review={},
    loading: postLoading,
    error: postError
  }, postReview] = useRest({
    route: 'reviews',
    method: 'POST',
    data: {}
  });

  const [{
    data: response={},
    loading: deleteLoading,
    error: deleteError
  }, deleteReview] = useRest({
    route: '',
    method: 'DELETE'
  });

  if (!username) {
    return {
      error: "Username is required!"
    };
  }

  return {
    getReviews,
    reviews,
    postReview,
    review,
    deleteReview,
    response,
    loading: loading || postLoading || deleteLoading,
    error: error || postError || deleteError
  };
}