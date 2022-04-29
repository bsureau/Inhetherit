const initialState = {
    account: "",
    balance: 0,
    signer: null
}

export default function appReducer(state = initialState, action) {
switch (action.type) {
    case 'INIT_WALLET': 
    return {
        account: action.account,
        balance: action.balance,
        signer: action.signer
    };
    default:
    return state
}
}
