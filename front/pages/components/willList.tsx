import React, { useEffect } from 'react';
import { Button, Col, Link, Row, Table, Text, Tooltip } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { useWill } from "../../context/will";
import { useUser } from "../../context/user";
import {
  getErc20NameFromAddress,
  getErc20Iso3FromAddress,
  erc20Abi,
  maxUINT256, erc20Addresses
} from "../../utils/erc20Contract";
import { getWill, removeErc20Token } from "../../utils/willContract";

const styles: any = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "3rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    marginBottom: "30px",
  },
}

async function approveTransfer(user, will, erc20Address) {
  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
  return await erc20Contract.approve(will.address, maxUINT256); //replace value by max uint256 value
}

export default function WillList() {
  const { will, setWill } = useWill();
  const { user } = useUser();

  const onIncreaseAllowance = async (erc20Address) => {
    const tx: TransactionResponse = await approveTransfer(user, will, erc20Address);

    // handle approve metamask modal, error and loading

    await tx.wait(1);

    setWill(await getWill(user));
  }

  const onDeleteToken = async (heirAddress, erc20Address) => {
    const tx: TransactionResponse = await removeErc20Token(user, heirAddress, erc20Address);

    // handle approve metamask modal, error and loading

    await tx.wait(1);

    setWill(await getWill(user));
  };

  return (
    <Col css={styles.column}>
      {will ?
        <Table lined css={{
          height: "auto",
          minWidth: "100%",
        }}>
          <Table.Header>
            <Table.Column>Status</Table.Column>
            <Table.Column>Token</Table.Column>
            <Table.Column>Heir Address</Table.Column>
            <Table.Column>Amount</Table.Column>
            <Table.Column></Table.Column>
          </Table.Header>
          <Table.Body>
            {will.claims.map((claim) => (
              <Table.Row key={claim.erc20Token}>
                <Table.Cell>
                  {claim.allowance < claim.balance ?
                    <>
                      <Tooltip content={"We won't be able to transfer your fund in case of your death"}>
                        <FaExclamationTriangle color="#f7ca18" size={20} style={{verticalAlign: 'middle'}}/>&nbsp;
                        <small>Allowance too low ({(ethers.utils.formatEther(claim.allowance) - (ethers.utils.formatEther(claim.balance)))} {getErc20Iso3FromAddress(claim.erc20Token)})</small>
                      </Tooltip>
                    </>
                    :
                    <>
                      <FaCheck color="#17c964" size={20} style={{verticalAlign: 'middle'}}/>&nbsp;
                      <small>All good</small>
                    </>
                  }
                </Table.Cell>
                <Table.Cell>
                  {getErc20Iso3FromAddress(claim.erc20Token)}
                </Table.Cell>
                <Table.Cell>
                  <Link href={`https://rinkeby.etherscan.io/address/${claim.heir}`} target="_blank">
                    {claim.heir.substring(0, 20)}...
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {ethers.utils.formatEther(claim.balance)} {getErc20Iso3FromAddress(claim.erc20Token)}
                </Table.Cell>
                <Table.Cell>
                  {claim.allowance < claim.balance ?
                    <Button onClick={() => onIncreaseAllowance(claim.erc20Token)}>Increase allowance</Button>
                    : ''
                  }
                  <Button light color="error" onClick={() => onDeleteToken(claim.heir, claim.erc20Token)}>
                    Delete token from will
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      :
        <Text css={{ color: '#888', fontWeight: 500 }}>
          You don't have any will yet
        </Text>

      }
    </Col>
  )
}
