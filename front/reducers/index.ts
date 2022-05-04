import {
  GlobalState,
  Action
} from '../types';

const initialState: GlobalState = {
  user: {
      account: "",
      balance: 0,
      signer: null, 
      will: "",
      claims: []
  },
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
        user: {
          ...state.user,
          balance: action.user.balance,
        }
      }
    case 'ADD_WILL':
      return {
        ...state,
        user: {
          ...state.user,
          will: action.user.will,
        }
      }
    case 'ADD_CLAIM':
      return {
        ...state,
        user: {
          ...state.user,
          claims: action.user.claims // TODO: add to array
        }
      }
    default:
      return state
  }
}
