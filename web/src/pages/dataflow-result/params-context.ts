import { createContext, useContext } from 'react';
import { NavigateToDataflowResultProps } from './interface';

export const DataflowResultParamsContext = createContext<
  Partial<NavigateToDataflowResultProps> | null
>(null);

export function useDataflowResultParamsContext() {
  return useContext(DataflowResultParamsContext);
}
