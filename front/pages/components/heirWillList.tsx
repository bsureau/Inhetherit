import React,  {useEffect} from 'react';
import { Button, Card, Col, Link, Text, Row, Grid } from '@nextui-org/react';
import {FaCheck, FaMinus, FaSkull} from 'react-icons/fa';

import { useHeirWills } from '../../context/heirWills';
import {ethers} from "ethers";
import {getErc20Iso3FromAddress, getTokenImgFromAddress} from "../../utils/erc20Contract";

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
  row: {
    marginTop: 20,
  },
  icon: {
    verticalAlign: 'middle',
    marginRight: 10,
  },
  fieldName: {
    fontWeight: 500,
  },
  tokensContainer: {
    marginTop: 10,
    flexWrap: "wrap"
  },
  tokenContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center"
  }
}

export default function HeirWillList() {
  const { heirWills } = useHeirWills();

  useEffect(function () {
    console.log('COUCOU')
    console.log("WILLS: ", heirWills);
  });
  
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
                          style={styles.icon} />
                        Available to claim
                      </>) : (
                      <>
                        <FaCheck
                          color="#17c964"
                          size={20}
                          style={styles.icon} />
                        Funds transfered
                      </>)
                    }
                  </Grid>
                  <Grid xs={6}>
                    Will &nbsp;
                    <Link
                      href={`https://rinkeby.etherscan.io/address/${will.address}`}
                      target="_blank"
                    >
                      #{will.address}
                    </Link>
                  </Grid>
                  <Grid xs={3}>
                    {will.state == 0 ? (
                      <Button bordered color="warning">
                        <FaSkull size={15} style={styles.icon}/> Report death
                      </Button>
                      ) : ''
                    }
                  </Grid>
                </Row>
                <Row style={styles.row}>
                  <Grid xs={5}>
                    <Col>
                      <Row><Text style={styles.fieldName}>From</Text></Row>
                      <Row><Text>
                        {will.firstName} {will.lastName} &nbsp;
                        {`<`}
                        <Link href={`https://rinkeby.etherscan.io/address/${will.giverAddress}`} target="_blank">
                          {will.giverAddress.substring(0,20)}...
                        </Link>
                        {`>`}
                      </Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={styles.fieldName}>Birthday</Text></Row>
                      <Row><Text>{will.birthdate}</Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={styles.fieldName}>Birth Postcode</Text></Row>
                      <Row><Text>{will.postCode}</Text></Row>
                    </Col>
                  </Grid>
                </Row>
                <Row style={styles.row}>
                  <Text h4>You will receive</Text>
                </Row>
                <Row justify="flex-start" align="center" css={styles.tokensContainer}>
                  <Grid.Container gap={2}>
                    {will.claims.map((claim) => (
                      <Grid xs={3} key={claim.address}>
                        <Card bordered shadow={false}>
                          <Row css={styles.tokenContent}>
                            <img src={getTokenImgFromAddress(claim.tokenAddress)} width="30px"/> &nbsp;&nbsp;&nbsp;
                            <Text>{ethers.utils.formatEther(claim.balance)} {getErc20Iso3FromAddress(claim.tokenAddress)}</Text></Row>
                        </Card>
                      </Grid>
                      )
                    )}
                  </Grid.Container>
                </Row>
              </Col>
            </Row>
          ))}
        </Col>
      :
        <Col css={{padding: "3rem 2rem", boxShadow: "0px 0.2rem 10px #e0e0e0", width: "85%", minWidth: "1000px", margin: "auto", borderRadius: "1rem", background: "#ffffff" }}>
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You're not listed in any will yet
          </Text>
        </Col>
      }
    </>
  )
}
