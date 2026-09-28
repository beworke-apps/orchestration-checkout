import { useSelector } from 'react-redux';

import type { RootState } from '@/store';

export function useAppSelector<TSelected>(selector: (state: RootState) => TSelected): TSelected {
  return useSelector(selector);
}
