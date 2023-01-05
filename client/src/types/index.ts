import { AxiosError } from 'axios';

export * from './user';
export * from './auth';
export * from './file';

// type guards

export function isAxiosError<T = any>(error: AxiosError | any): error is AxiosError<T> {
  return error && error.isAxiosError;
}
