import { createContextualCan } from '@casl/react';
import { createContext } from 'react';

export const AbilityContext = createContext<any>({});
export const Can = createContextualCan(AbilityContext.Consumer);
