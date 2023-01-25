import UseCase from '../UseCase';

export enum UseCaseName {
  InitiateUpload = 'InitiateUpload',
}

interface UseCaseFactory {
  make: (useCaseName: UseCaseName, args: Object) => UseCase;
}

export default UseCaseFactory;
