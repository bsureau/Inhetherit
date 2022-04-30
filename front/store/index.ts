import { createStore, Action, Store, GlobalState } from 'redux';
import rootReducer from '../reducers';

export const store: Store<GlobalState, Action> = createStore(rootReducer);
