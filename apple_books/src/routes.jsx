import React from 'react';
import {Route} from 'react-router-dom';

import BooksPage from './pages/booksPage';
import ReviewsPage from './pages/reviewsPage';
import ReviewForm from './pages/reviewForm';
import Feed from './pages/feed';

const Routes = () => {
  return (
    <div>
      <Route exact path='/' component={BooksPage} />
      <Route path='/books' component={BooksPage} />
      <Route path='/reviews' component={ReviewsPage} />
      <Route path='/form' component={ReviewForm} />
      <Route path='/feed' component={Feed} />
    </div>
  );
};

export default Routes;