import React, { useEffect } from 'react';
import { Button, Col, Link, Row, Table, Text, Tooltip } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { store } from '../../store';

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

  useEffect(() => {
    setTimeout(() => console.log(store.getState().user.claims), 1200);
  }, []);

  return (
    <Col css={styles.column}>
      <Table lined css={{
        height: "auto",
        minWidth: "100%",
      }}>
        <Table.Header>
          <Table.Column>Status</Table.Column>
          <Table.Column>Crypto</Table.Column>
          <Table.Column>Heir Address</Table.Column>
          <Table.Column>Amount</Table.Column>
          <Table.Column></Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Tooltip content={"That means we won't be able to execute your will"}>
                <FaExclamationTriangle color="#f7ca18" size={20} style={{ verticalAlign: 'middle' }} />&nbsp; <small>Missing Approval</small>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>
              Chainlink
            </Table.Cell>
            <Table.Cell>
              <Link href="https://rinkeby.etherscan.io/address" target="_blank">
                {"0x90ld57839b00206d1ad20c69a1981b489f772031".substring(0, 20)}...
              </Link>
            </Table.Cell>
            <Table.Cell>
              130 LINK
            </Table.Cell>
            <Table.Cell>
              <Button>Approve transfert</Button>
              <Button light color="error">Delete will</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <FaCheck color="#16a085" size={20} style={{ verticalAlign: 'middle' }} />&nbsp; <small>All good</small>
            </Table.Cell>
            <Table.Cell>
              Ethereum
            </Table.Cell>
            <Table.Cell>
              <Link href="https://rinkeby.etherscan.io/address" target="_blank">
                {"0x84jd57839b00206d1ad20c69a1981b489f772031".substring(0, 20)}...
              </Link>
            </Table.Cell>
            <Table.Cell>
              130.48267 ETH
            </Table.Cell>
            <Table.Cell>
              <Button light color="error">Delete will</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Tooltip content={"That means we won't be able to execute your will"}>
                <FaExclamationTriangle color="#f7ca18" size={20} style={{ verticalAlign: 'middle' }} />&nbsp; <small>Allowance too low</small>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>
              Wrapped Ethereum
            </Table.Cell>
            <Table.Cell>
              <Link href="https://rinkeby.etherscan.io/address" target="_blank">
                {"0x7ffc57839b00206d1ad20c69a1981b489f772031".substring(0, 20)}...
              </Link>
            </Table.Cell>
            <Table.Cell>
              30 WETH
            </Table.Cell>
            <Table.Cell>
              <Button>Increase allowance</Button>
              <Button light color="error">Delete will</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Col>
  )
}
