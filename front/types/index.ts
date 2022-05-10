import { BigNumber, Signer } from "ethers";
import { ExternalProvider } from '@ethersproject/providers';

export type User = {
    account: string;
    balance: BigNumber | number;
    signer: Signer | null;
    will?: Will;
};

export type Will = {
    address: string;
    claims: Array<Claim>;
}

export type Claim = {
    erc20TokenAddress: string;
    heirAddress: string;
    hasBeenTransferred: boolean;
};

export type GlobalState = {
    user: User;
};

export type Action = {
    type: string;
    user?: User;
}

declare global {
    interface Window {
        ethereum: ExternalProvider;
    }
};
