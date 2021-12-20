import {useRest} from './useRest';

export const useBooks = () => {
  const [{
    data: books=[],
    loading,
    error
  }, getBooks] = useRest({
    route: 'books',
    method: 'GET'
  });

  return {
    getBooks,
    books,
    loading,
    error
  };
}