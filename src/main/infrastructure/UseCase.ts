import Request from './Request';

interface UseCase {
  // This has to return void
  // and the result should be passed to a messenger
  // withing the execute method
  // but I really have no idea how to do this right now
  execute(request: Request): any;
}

export default UseCase;
