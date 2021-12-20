import useAxios from 'axios-hooks';
import { API_URL } from './constants';

export const useRest = ({
  route, method, headers={}, data={}, manual=true, useCache=false
}) => {
  const url = API_URL + route;
  return useAxios({
    url,
    method,
    data,
    headers
  }, {
    manual,
    useCache
  });
}

