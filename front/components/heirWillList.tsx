import React  from 'react';
import { Button, Card, Col, Link, Text, Row, Grid } from '@nextui-org/react';

import { FaRainbow, FaMoneyCheck, FaCheck } from 'react-icons/fa';

import { Contract, ethers } from "ethers";

import { useUser } from "../context/user";
import { useHeirWills } from '../context/heirWills';
import { useModal } from "../context/modal";

import { getErc20Iso3FromAddress, getTokenImgFromAddress } from "../utils/erc20Contract";
import {claimFunds, getHeirWills, reportDeath} from '../utils/willContract';

import {
  ConfirmDeathModal,
  DeathConfirmedModal,
  ErrorModal,
  FundsTransferedModal,
  LoadingModal,
  MetamaskConfirmModal
} from "./modals";

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
    padding: "3rem"
  },
  row: {
    marginTop: 20,
  },
  col: {
    width: 'max-content',
    marginRight: '5rem'
  },
  icon: {
    verticalAlign: "middle",
    marginRight: 10,
  },
  fieldName: {
    fontWeight: 700,
  },
  tokensContainer: {
    marginTop: 10,
    flexWrap: "wrap",
  },
  tokenContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center"
  }, 
  card: {
    width: "200px"
  }
}

export default function HeirWillList() {
  const { heirWills, setHeirWills } = useHeirWills();
  const { user } = useUser();
  const { modal, setModal } = useModal();

  const MODAL_CONFIRM_DEATH = 'claims-confirm-death';
  const MODAL_METAMASK_CONFIRM = 'claims-metamask-confirm';
  const MODAL_LOADING = 'claims-loading';
  const MODAL_ERROR   = 'claims-error';
  const MODAL_DEATH_CONFIRMED = 'claims-death-confirmed';
  const MODAL_FUNDS_TRANSFERED = 'claims-funds-transfered';

  const onReportDeath = async (willAddress: string) => {
    setModal({
      open: MODAL_CONFIRM_DEATH,
      data: {
        willAddress: willAddress,
      }
    });
  }

  const onConfirmDeath = async (willAddress, deathDate) => {
    setModal({
      open: MODAL_METAMASK_CONFIRM,
      data: {},
    });

    try {
      await reportDeath(
        willAddress,
        deathDate,
        () => setModal({ open: MODAL_LOADING, data: { text: "Contacting API to confirm death..." } }),
        async (result: boolean) => {
          setModal({
            open: result === false ? MODAL_ERROR : MODAL_DEATH_CONFIRMED,
            data: {
              text: result === false ? "We could not confirm the death" : "",
              willAddress: willAddress,
            }
          });

          if (result === true) {
            // update heir wills list
            setHeirWills(await getHeirWills(user));
          }
        },
        user
      );
    } catch(error) {
      setModal({
        open: MODAL_ERROR,
        data: {
          text: "Please check if the contract has enough LINK (min 0.05 LINK required)",
          error: error,
        }
      });
      return;
    }
  }

  const onClaimFunds = async (willAddress: string) => {
    setModal({
      open: MODAL_METAMASK_CONFIRM,
      data: { }
    });

    try {
      await claimFunds(
        willAddress,
        () => setModal({
          open: MODAL_LOADING,
          data: {
            text: "Contacting contract to transfer funds"
          }
        }),
        async (address) => {
          setModal({
            open: MODAL_FUNDS_TRANSFERED,
            data: {
              address: address
            }
          });

          // update heir wills list
          setHeirWills(await getHeirWills(user));
        },
        user,
      );
    } catch (error) {
      setModal({
        open: MODAL_ERROR,
        data: {
          text: "We could not transfer the funds at the moment...",
          error: error,
        }
      });
      return;
    }
  }
  
  return (
    <>
      {heirWills && heirWills.length > 0 ?
        <>
          <Col>
            {heirWills.map((will) => (
              <Row css={styles.column} key={will.address}>
                <Col align="center" justify="center">
                  <Row>
                    <Grid xs={6}>
                      <Col>
                        <Row>
                          <Text weight="bold" color="primary">Will contract: &nbsp;</Text>
                        </Row>
                        <Row>
                          <Text>
                            <Link
                              href={`https://rinkeby.etherscan.io/address/${will.address}`}
                              target="_blank"
                              color="black"
                            >
                              {will.address}
                            </Link>
                          </Text>
                        </Row>
                      </Col>
                    </Grid>
                    <Grid xs={3} css={{position: "absolute", right: 0}}>
                      {will.fundsTransferedTx ? (
                        <Link href={`https://rinkeby.etherscan.io/tx/${will.fundsTransferedTx}`} target="_blank">
                          <Button bordered size="lg" color="success">
                            <FaCheck size={20} style={styles.icon}/> Funds transferred
                          </Button>
                        </Link>
                          )
                      :
                        will.state == 0 ? (
                          <Button bordered size="lg" onClick={() => { onReportDeath(will.address)} }>
                            <FaRainbow size={20} style={styles.icon}/> Report death
                          </Button>
                          ) :
                          <Button bordered size="lg" onClick={() => { onClaimFunds(will.address)} }>
                            <FaMoneyCheck size={20} style={styles.icon}/> Claim funds
                          </Button>
                      }
                    </Grid>
                  </Row>
                  <Row style={styles.row}>
                      <Col style={styles.col}>
                        <Row><Text style={styles.fieldName} color="primary">From: </Text></Row>
                        <Row>
                          <Text>
                            {will.firstName} {will.lastName} &nbsp;
                            {`<`}
                            <Link color="black" href={`https://rinkeby.etherscan.io/address/${will.giverAddress}`} target="_blank">
                            {will.giverAddress.substring(0, 35)}...
                            </Link>
                            {`>`}
                          </Text>
                        </Row>
                      </Col>
                      <Col style={styles.col}>
                        <Row><Text style={styles.fieldName} color="primary">Birth date: </Text></Row>
                        <Row><Text>{will.birthdate}</Text></Row>
                      </Col>
                      <Col style={styles.col}>
                        <Row><Text style={styles.fieldName} color="primary">Birth Postcode: </Text></Row>
                        <Row><Text>{will.postCode}</Text></Row>
                      </Col>
                  </Row>
                  {will.fundsTransferedTx === null &&
                    <>
                      <Row style={styles.row}>
                        <Text style={styles.fieldName} color="primary">You will receive: </Text>
                      </Row>
                      <Row justify="flex-start" align="center" css={styles.tokensContainer}>
                        <Grid.Container gap={2}>
                          {will.claims.map((claim) => (
                            <Grid xs={3} key={claim.address}>
                              <Card bordered shadow={false} css={styles.card}>
                                <Row css={styles.tokenContent}>
                                  <img src={getTokenImgFromAddress(claim.tokenAddress)} width="30px"/> &nbsp;&nbsp;&nbsp;
                                  <Text>{ethers.utils.formatEther(claim.balance)} {getErc20Iso3FromAddress(claim.tokenAddress)}</Text></Row>
                              </Card>
                            </Grid>
                            )
                          )}
                        </Grid.Container>
                      </Row>
                    </>
                  }
                </Col>
              </Row>
            ))}
          </Col>

          <ConfirmDeathModal
            onCloseModal={() => null}
            isOpened={modal.open == MODAL_CONFIRM_DEATH}
            willAddress={modal.data.willAddress}
            onConfirmDeath={(willAddress, deathDate) => onConfirmDeath(willAddress, deathDate)}
          />
          <MetamaskConfirmModal isOpened={modal.open == MODAL_METAMASK_CONFIRM} />
          <DeathConfirmedModal
            onCloseModal={() => null}
            isOpened={modal.open == MODAL_DEATH_CONFIRMED}
            willAddress={modal.data.willAddress}
            onTransferfunds={(willAddress) => onClaimFunds(willAddress)}
          />
          <FundsTransferedModal
            isOpened={modal.open == MODAL_FUNDS_TRANSFERED}
            address={modal.data.address}
          />
          <ErrorModal
            onCloseModal={() => null}
            isOpened={modal.open == MODAL_ERROR}
            error={modal.data.error}
            text={modal.data.text}
          />
          <LoadingModal
            isOpened={modal.open == MODAL_LOADING}
            text={modal.data.text}
          />
        </>
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
