export const createQueryParams = (queryObject: { [key: string]: any }) => {
  const queryArray: any[] = [];

  Object.keys(queryObject).forEach(key => {
    if (
      queryObject[key] === undefined ||
      queryObject[key] === null ||
      queryObject[key] === '' ||
      (Array.isArray(queryObject[key]) && queryObject[key].length === 0)
    )
      return;

    if (Array.isArray(queryObject[key])) {
      queryObject[key].forEach((el: any) => {
        queryArray.push(`${key}=${el}`);
      });
    } else {
      queryArray.push(`${key}=${queryObject[key]}`);
    }
  });

  return queryArray.length === 0 ? '' : '?' + queryArray.join('&');
};
