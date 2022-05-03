import {
  GlobalState,
  Action
} from '../types';

const initialState: GlobalState = {
  user: {
      account: "",
      balance: 0,
      signer: null, 
      will: ""
  }
};

export default function appReducer(state: GlobalState = initialState, action: Action) {
  switch (action.type) {
    case 'INIT_USER':
      return {
        ...state,
        user: action.user,
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        wallet: {
          ...state.user,
          balance: action.user.balance,
        }
      }
    default:
      return state
  }
}
