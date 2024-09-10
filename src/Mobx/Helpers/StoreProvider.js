import { createContext } from 'react';
import Store from '../Stores';

export const StoreContext = createContext(Store);
export const StoreProvider = StoreContext.Provider;