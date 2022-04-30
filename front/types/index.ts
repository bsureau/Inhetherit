import { BigNumber, Signer } from "ethers";
import { ExternalProvider } from '@ethersproject/providers';

export type User = {
    account: string;
    balance: BigNumber | number;
    signer: Signer | null;
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
