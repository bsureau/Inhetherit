import React from 'react';
import { Button, Col, Row, Table, Text, Tooltip } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

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

  return (
    <Col css={styles.column}>
      <Table lined css={{
        height: "auto",
        minWidth: "100%",
      }}>
        <Table.Header>
          <Table.Column>Status</Table.Column>
          <Table.Column>Crypto</Table.Column>
          <Table.Column>Name</Table.Column>
          <Table.Column>Address</Table.Column>
          <Table.Column>Amount</Table.Column>
          <Table.Column></Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Tooltip content={"That means we won't be able to execute your will"}>
                <FaExclamationTriangle color="#f9690e" size={20} />&nbsp; <small>Missing Approval</small>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>
              Link
            </Table.Cell>
            <Table.Cell>
              Romain Quilliot
            </Table.Cell>
            <Table.Cell>
              blablabla
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
              <FaCheck color="#16a085" size={20} />&nbsp; <small>All good</small>
            </Table.Cell>
            <Table.Cell>
              Ethereum
            </Table.Cell>
            <Table.Cell>
              Romain Quilliot
            </Table.Cell>
            <Table.Cell>
              blablabla
            </Table.Cell>
            <Table.Cell>
              130 ETH
            </Table.Cell>
            <Table.Cell>
              <Button light color="error">Delete will</Button>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Tooltip content={"That means we won't be able to execute your will"}>
                <FaExclamationTriangle color="#f9690e" size={20} />&nbsp; <small>Allowance too low</small>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>
              Wrapped Ethereum
            </Table.Cell>
            <Table.Cell>
              Romain Quilliot
            </Table.Cell>
            <Table.Cell>
              blablabla
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
