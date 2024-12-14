import { EStatusState } from '@/enums';

export interface ProjectState {
  projects: any[];
  isLoading: boolean;
  status: EStatusState;
  errors: any | null;
}

export const initialProjectState: ProjectState = {
  projects: [],
  isLoading: false,
  status: EStatusState.Idle,
  errors: null,
};
