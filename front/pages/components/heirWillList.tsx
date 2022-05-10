import React from 'react';
import { Button, Card, Col, Link, Text, Row, Grid } from '@nextui-org/react';
import {FaCheck, FaMinus, FaSkull} from 'react-icons/fa';

import { useHeirWills } from '../../context/heirWills';

const styles: any = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "1rem",
    marginBottom: "2rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    padding: "3rem 2rem"
  },
}

export default function HeirWillList() {
  const { heirWills } = useHeirWills();

  return (
    <>
      {heirWills && heirWills.length > 0 ?
        <Col>
          {heirWills.map((will) => (
            <Row css={styles.column} key={will.address}>
              <Col align="center" justify="center">
                <Row>
                  <Grid xs={3}>
                    {will.state == 0 ? (
                      <>
                        <FaMinus
                          color="#888" size={20}
                          style={{verticalAlign: 'middle'}}/>&nbsp;
                        Available to claim
                      </>) : (
                      <>
                        <FaCheck
                          color="#17c964"
                          size={20}
                          style={{verticalAlign: 'middle'}}/>&nbsp;
                        Funds transfered
                      </>)
                    }
                  </Grid>
                  <Grid xs={6}>
                    Will &nbsp;
                    <Link
                      href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank"
                      className="secondary-button"
                    >
                      #{will.address}
                    </Link>
                  </Grid>
                  <Grid xs={3}>
                    <Button bordered color="warning"><FaSkull size={15} style={{ marginRight: 10 }}/> Report death</Button>
                  </Grid>
                </Row>
                <Row style={{ marginTop: 20 }}>
                  <Grid xs={5}>
                    <Col>
                      <Row><Text style={{ fontWeight: 500 }}>From</Text></Row>
                      <Row><Text style={{ display: 'block' }}>
                        Romain Quilliot &nbsp;
                        {`<`}<Link href="">0x00000000000000000000000</Link>{`>`}
                      </Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={{ fontWeight: 500 }}>Birthday</Text></Row>
                      <Row><Text style={{ display: 'block' }}>24/07/1996</Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={{ fontWeight: 500 }}>Birth Postcode</Text></Row>
                      <Row><Text style={{ display: 'block' }}>95300</Text></Row>
                    </Col>
                  </Grid>
                </Row>
                <Row style={{ marginTop: 20 }}>
                  <Text h4>Your claims</Text>
                </Row>
                <Row justify="flex-start" align="center"
                     css={{
                       marginTop: 10,
                       flexWrap: "wrap"
                     }}>
                  <Grid.Container gap={2}>
                    <Grid xs={3}>
                      <Card bordered shadow={false}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/ETH.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>2.6788388347 ETH</Text></Row>
                      </Card>
                    </Grid>
                    <Grid xs={3}>
                      <Card bordered shadow={false}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                    </Grid>
                    <Grid xs={3}>
                      <Card bordered shadow={false}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                    </Grid>
                    <Grid xs={3}>
                      <Card bordered shadow={false}>
                        <Row css={{display: "flex", flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}><img src="token-img/LINK.png" width="30px"/> &nbsp;&nbsp;&nbsp; <Text>10 LINK</Text></Row>
                      </Card>
                    </Grid>
                  </Grid.Container>
                </Row>
              </Col>
            </Row>
          ))}
        </Col>
      :
        <Col css={styles.column}>
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You're not listed in any will yet
          </Text>
        </Col>
      }
    </>
  )
}
