import { BigNumber, Signer } from "ethers";
import { ExternalProvider } from '@ethersproject/providers';

export type Giver = {
    account: string;
    balance: BigNumber | number;
    signer: Signer | null;
    will?: Will;
};

export type Heir = {
    account: string;
    signer: Signer | null;
    wills: Array<string>;
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
    giver: Giver;
};

export type Action = {
    type: string;
    giver?: Giver;
}

declare global {
    interface Window {
        ethereum: ExternalProvider;
    }
};
