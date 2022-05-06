export default class Claim {

    heir: string;
    erc20Token: string;
    filled: boolean;

    constructor(heir: string, erc20Token: string, filled: boolean) 
    {
        this.heir = heir;
        this.erc20Token = erc20Token;
        this.filled = filled;
    }
    
    getHeir(): string 
    {
        return this.heir;
    }
    
    getErc20Token(): string 
    {
        return this.erc20Token;
    }
    
    isFilled(): boolean 
    {
        return this.filled;
    }
}
