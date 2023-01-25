import Request from '../Request';

export const enum RequestName {
  InitiateUpload = 'InitiateUpload',
}

interface RequestBuilder {
  build: (requestName: RequestName, args: Object) => Request;
}

export default RequestBuilder;
