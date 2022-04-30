import { BigNumber, Signer } from "ethers";

type Wallet = {
  account: string;
  balance: BigNumber | number;
  signer: Signer | null;
};

type GlobalState = {
  wallet: Wallet;
};

type Action = {
  type: string;
  wallet?: Wallet;
}

const initialState: GlobalState = {
  wallet: {
    account: "",
    balance: 0,
    signer: null,
  }
};

export default function appReducer(state: GlobalState = initialState, action: Action) {
  switch (action.type) {
    case 'INIT_WALLET':
      return {
        ...state,
        wallet: action.wallet,
      };
    default:
      return state
  }
}
