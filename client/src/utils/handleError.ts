import { isAxiosError } from 'types';

const handleError = (e: any) => {
  // here you can handle all common types of errors
  if (isAxiosError(e)) {
    console.log({ ...e });
  } else {
    console.log(e.message);
  }
};

export default handleError;
