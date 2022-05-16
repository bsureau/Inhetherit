# **🌈Inhetherit**
### _Your cryptos should never disappear when you die. Plan to pass on your cryptos to your loved ones!_

> ⚠️ **Reminder:** Inhetherit was made during Chainlink Spring 22 Hackathon and is only available on testnet 

## What is it?
One must always have foresight in life. After I bought my first apartment with my wife, I, for the first time ever, wrote a will at the notary. And the issue of passing on my cryptocurrencies arose very quickly. First of all, because crypto-currencies are not yet well defined in terms of legislation. And even so my wife, or my notary, would still need to have access to my private key in order to release the funds. Wouldn't there be a more direct, fast, secured and reliable way to solve this problem? That's how we came up with the idea of developing 🌈 **Inhetherit**. 

## What it does?
Inhetherit is a Dapp developed on Ethereum smart contracts platform that allows you to pass on your cryptos (ETH, any ERC20 tokens, ERC721 soon) to whoever you want, in case of your death. In just 5 minutes of your time, you can create a will contract linked to your wallet, and give it the permission to transfer your funds to your heirs when you die. It then uses Chainlink to request death records from a public API maintained by the French national institute for statistics (our Dapp is only available in France for now). In this way, if your name appears in these records when you die, all your approved funds will be automatically transferred to the corresponding addresses you gave during will creation. 

**In order to resume:**

**I. As a giver:**
- Create a will contract with your Ethereum wallet
- Give the permission to your contract to transfer your funds (ETH, any ERC20 tokens, ERC721 soon) to one or more heirs

**II. As a heir:**
- You lost someone who gave you their cryptos using Inhetherit? Just claim it!

## How we built it?
- We first created our smart contracts with Solidity and made some tests using Hardhat development environment
- We then used Chainlink to make a GET request to gov API from our smart contract (special thanks to Ijonas we met on Chainlink Discord for all the support!)
- The frontend part was developed using Next.js React framework and Ethers.js library for interacting with the Ethereum Blockchain
- The website is deployed on Vercel cloud platform

## Challenges we ran into
- Learning Solidity
- Dealing with ERC-20 tokens (approval workflow)
- Connecting our smart contract with off-chain datas through Chainlink network
- Discovering Next.js and Ethers.js library
- Struggling with shared state in NextJS
- Trying to design optimal user experience despite constraints such as ERC20 token approval workflow

## Accomplishments that we're proud of
- Discovering Solidity, Chainlink, web3 infrastructure…
- Do some front-end development as a back-end developers
- Participate to our first hackathon and release an MVP in less than one month
- Trying to do something else than NFTs with a project which is trying to respond to a real life problem and which seems never to have been tackled before

## What we learned?
- Web3 is awesome and a massive environment to innovate on
- Solidity was pretty easy to learn, but all the standards around (eg: ERC20 and approval workflow) can quickly make it a complex world
- Chainlink is definitely a key component of Web3 infrastructure
- You’ll go further if you have a teammate

## What's next for 🌈 Inhetherit?
Here are some improvement ideas we’ve already think of:
- Accept ERC721 tokens (NFTs)
- Be able to split a certain % of a same ERC20 token to different heirs
- Propose to users to give their funds to associations
- Make frontend responsive
- Make Dapp cross chain interoperable (Chainlink CCIP?)
- Explore L2 scaling solutions
- Integrate with other gov APIs and expand all around the world
- Extend security while preserving privacy (Chainlink Mixicles?)

## Demo video
[![watch here](https://i.ibb.co/fpfS4FM/Capture-d-e-cran-2022-05-16-a-14-35-48.png)](https://www.youtube.com/watch?v=9KKFVsAiAqU)

## Wanna try? 
🔗 [inhetherit.link](https://www.inhetherit.link)
