import { isAxiosError } from 'types';

const handleError = (e: any) => {
  // here you can handle all common types of errors
  let message = e.message as string;

  if (isAxiosError(e) && e.response?.data?.error) {
    message = e.response.data.error;
    console.log({ ...e });
  }

  console.log(message);
  return message;
};

export default handleError;
