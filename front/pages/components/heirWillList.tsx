import React from 'react';
import { Button, Col, Table, Link, Text, Row, Spacer } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { useHeirWills } from '../../context/heirWills';

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
  const { heirWills } = useHeirWills();

  return (
    <>
    <Col css={styles.column}>
        {heirWills && heirWills.length > 0 ?
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
                {heirWills.map((will) => (
                  <Table.Row key={will.address}>
                    <Table.Cell>
                      {will.state == 0 ? (
                        <>
                          <FaExclamationTriangle
                            color="#f7ca18" size={20}
                            style={{verticalAlign: 'middle'}}/>&nbsp;
                          Funds to claim
                        </>) : (
                        <>
                          <FaCheck
                            color="#17c964"
                            size={20}
                            style={{verticalAlign: 'middle'}}/>&nbsp;
                          Funds transfered
                        </>)
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank"
                        className="secondary-button"
                      >
                        {will.address}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={`/claim/${will.address}`}>
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
