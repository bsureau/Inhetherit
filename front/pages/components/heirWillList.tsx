import React from 'react';
import { Button, Col, Table, Link, Text, Row, Spacer } from '@nextui-org/react';

import { useWills } from '../../context/wills';

const styles: any = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "1rem",
    marginBottom: "1rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    padding: "0rem 0 0rem 0"
  },
}

export default function HeirWillList() {

  const {wills, setWills} = useWills();

  return (
    <>
    <Col css={styles.column}>
        {wills && wills.length > 0 ?
          <>
            <Table lined css={{
              height: "auto",
              minWidth: "100%",
            }}>
              <Table.Header>
                <Table.Column>Status</Table.Column>
                <Table.Column>Will contract</Table.Column>
                <Table.Column></Table.Column>
              </Table.Header>
              <Table.Body>
                {wills.map((address) => (
                  <Table.Row key={address}>
                    <Table.Cell>
                      Status (Funds to claim/Funds transfered)
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`https://rinkeby.etherscan.io/address/${address}`} target="_blank"
                        className="secondary-button"
                      >
                        {address}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={`/claim/${address}`}>
                        <Button>Details</Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        :
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You're not listed in any will yet
          </Text>
        }
      </Col>
    </>
  )
}
