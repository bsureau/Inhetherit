import React, { useEffect } from 'react';
import { Button, Col, Link, Row, Table, Text, Tooltip } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { ethers } from 'ethers';

import { useWill } from "../../context/will";
import { useUser } from "../../context/user";
import { getErc20NameFromAddress, getErc20Iso3FromAddress, getBalanceOf } from "../../utils/erc20Contract";

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

export default function WillList() {
  const { will } = useWill();
  const { user } = useUser();

  return (
    <Col css={styles.column}>
      {will ?
        <Table lined css={{
          height: "auto",
          minWidth: "100%",
        }}>
          <Table.Header>
            <Table.Column>Status</Table.Column>
            <Table.Column>Token Name</Table.Column>
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
                  {getErc20NameFromAddress(claim.erc20Token)}
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
                    <Button>Increase allowance</Button>
                    : ''
                  }
                  <Button light color="error">Delete will</Button>
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
