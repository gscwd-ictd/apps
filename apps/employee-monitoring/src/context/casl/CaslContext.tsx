import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AnyAbility } from '@casl/ability';

export const AbilityContext = createContext<AnyAbility | undefined>(undefined);
export const Can = createContextualCan(AbilityContext.Consumer as React.Consumer<AnyAbility>);
