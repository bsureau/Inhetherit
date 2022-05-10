import React from 'react';
import { Button, Card, Col, Link, Text, Row, Spacer } from '@nextui-org/react';

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
        { heirWills && heirWills.length > 0 ?
           heirWills.map((will) => (
            <Row>
              <Row
                css={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  textAlign:"left",
                  padding: "2rem",

                }}
              >
                <Col 
                  css= {{
                    width: "-webkit-fill-available",
                    marginRight: "1.5%",
                  }}
                >
                  <Row justify="flex-start" align="center"
                  css={{
                    flexWrap: "wrap",
                    minWidth: 1000
                  }}>
                      <Text weight="bold">Will contract:&nbsp;</Text>
                      <Link
                        href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank">
                        {will.address}
                      </Link>
                      <Spacer />
                      <Button css={{
                        position: "absolute",
                        right: 0
                      }}>Report death</Button>
                  </Row>
                  <Spacer />
                  <Row>
                    <Text><strong>From: </strong>Jean Bono</Text>
                    <Spacer />
                    <Text><strong>Born on: </strong>01/01/1933</Text>
                    <Spacer />
                    <Text><strong>Wallet address: </strong> 
                      <Link href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank">
                        {will.address}
                      </Link>
                    </Text>
                  </Row>
                  <Spacer />
                  <Row>
                    <Text><strong>Your claims: </strong></Text>
                  </Row>
                  <Spacer />
                  <Row justify="flex-start" align="center"
                    css={{
                      flexWrap: "wrap"
                    }}>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                      <Card bordered shadow={false} css={{ mw: "180px", margin: "1rem"}}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                  </Row>
                </Col>
              </Row>
            </Row>
          ))
        :
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You're not listed in any will yet
          </Text>
        }
      </Col>
    </>
  )
}
