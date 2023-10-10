import { UserBoundaryDTO } from '../../domain/entities/User';

export type UpdateUserRequestDTO = Omit<
  UserBoundaryDTO,
  'id' | 'createdAt' | 'updatedAt' | 'role' | 'administratorLevel'
>;
