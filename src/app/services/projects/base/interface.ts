import type { EStatusState } from '@/enums';

/**
 * Represents the global state of the application.
 */
interface State {
  isLoading?: boolean;
  data?: any;
  status?: EStatusState;
}
export default State;
