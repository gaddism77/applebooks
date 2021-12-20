import React from 'react';
import {useForm} from 'react-hook-form';
import {useHistory} from 'react-router-dom';
import {HeaderContext} from '../hooks/headerContext';
import {useReviews} from '../hooks/useReviews';
import {API_URL} from '../hooks/constants';

import '../styles.css';

export default function ReviewForm({location}) {
  const { username } = React.useContext(HeaderContext);
  const history = useHistory();
  const { 
    postReview, 
    review={}, 
    deleteReview,
    response,
    loading,
    error 
  } = useReviews(); 
  const {register, handleSubmit, errors} = useForm();

  //Must come from specific pages.. so deep copy object and clear state
  const data = React.useRef({});
  React.useEffect(() => {
    if (location && location.state && location.state.data) {
      data.current = JSON.parse(JSON.stringify(location.state.data));
      if (history.location.state && history.location.state.data) {
        let state = { ...history.location.state };
        delete state.data;
        history.replace({ ...history.location, state });
      }
    }
  }, [history, location])
  
  if (!username) {
    return (
      <div>You need to enter your username to view results!</div>
    );
  }

  const bookid = data.current.bookid || data.current.id;
  if (!bookid) {
    return (
      <div>How did you come here? You need to navigate through books or reviews!</div>
    );
  }
  
 // console.log(!!location, !!location.state, !!location.state.data)
  const handleDelete = () => {
    deleteReview({url: API_URL + 'reviews/' + data.current._id});
  };
  const DeleteButton = () => data.bookid ? <button onClick={handleDelete}>Delete...</button> : null;

  const formSubmit = (formData={}) => {
    const payload = {
      username,
      bookid,
      'rating': Number(formData.rating),
      'reviewText': formData.review
    };
    postReview({data: payload});
  };

  if (Object.keys(review).length) {
    return (
      <div>Review submitted successfully!</div>
    );
  }

  if (response && response.status === 204) {
    return (
      <div>{response.message}</div>
    );
  }

  return (
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div>
            <label>Rating (0-5): </label>
            <input
              name='rating'
              defaultValue={data.current['rating']}
              type='number'
              ref={register({
                required: {
                  value: true,
                  message: 'Rating is required!'
                },
                min: {
                  vallue: 0,
                  message: 'Minimum value is 0!'
                },
                max: {
                  value: 5,
                  message: 'Maximim value is 5!'
                }
              })}
            />
            {errors.rating && (
              <div className="error">{errors.rating.message}</div>
            )}
          </div>
          <div>
            <label>Review (max. 254 characters): </label>
            <input
              name='review'
              defaultValue={data.current['review text']}
              type='text'
              ref={register({
                required: {
                  value: true,
                  message: 'Review text is required!'
                },
                maxLength: {
                  value: 254,
                  message: 'Must be less than 254 characters!'
                }
              })}
            />
            {errors.review && (
              <div className="error">{errors.review.message}</div>
            )}
          </div>

          <button disabled={Object.keys(errors).length || !username || !bookid || loading} 
            type="submit">Submit...</button>
        </form>
        <div className='aside'>
          <DeleteButton/>
        </div>   
        {error ?  error.message : null}
      </div>
  );
}