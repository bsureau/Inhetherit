import React from 'react';
import { Button, Col, Image, Link, Table, Text, Tooltip, Row } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { ethers } from 'ethers';
import { TransactionResponse } from "@ethersproject/abstract-provider";

import { useWill } from "../../context/will";
import { useUser } from "../../context/user";
import { useModal } from "../../context/modal";

import {
  getErc20Iso3FromAddress,
  getTokenImgFromAddress,
  erc20Abi,
  isERC20Token,
  maxUINT256ForToken
} from "../../utils/erc20Contract";
import { getWill, removeErc20Token, removeEth } from "../../utils/willContract";
import {ConfirmationModal, ErrorModal, LoadingModal, MetamaskConfirmModal} from "./modals";

const styles: any = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "0rem 0 0rem 0"
  },
}

async function approveTransfer(user, will, erc20Address) {
  const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, user.signer);
  return await erc20Contract.approve(will.address, maxUINT256ForToken(getErc20Iso3FromAddress(erc20Address)));
}

export default function WillList() {
  const { will, setWill } = useWill();
  const { user } = useUser();
  const {modal, setModal} = useModal();

  // modals
  const MODAL_METAMASK_VALIDATE = 'list-metamask-validate';
  const MODAL_LOADING = 'list-loading';
  const MODAL_CONFIRMATION = 'list-confirmation';
  const MODAL_ERROR = 'list-error';

  const onIncreaseAllowance = async (erc20Address) => {
    let tx: TransactionResponse;

    setModal({
      open: MODAL_METAMASK_VALIDATE,
      data: { }
    });

    try {
      tx = await approveTransfer(user, will, erc20Address);
    } catch(error) {
      setModal({
        open: MODAL_ERROR,
        data: {
          text: 'We could not increase the allowance for your '+ getErc20Iso3FromAddress(erc20Address),
          error: error,
        }
      });
      return;
    }

    setModal({
      open: MODAL_LOADING,
      data: {
        text: 'Increasing allowance for your '+ getErc20Iso3FromAddress(erc20Address),
      }
    });

    await tx.wait(1);

    setWill(await getWill(user));

    setModal({
      open: MODAL_CONFIRMATION,
      data: {
        text: 'Your '+ getErc20Iso3FromAddress(erc20Address) +' allowance has been increased'
      }
    });
  }

  const onDeleteToken = async (heirAddress, erc20Address) => {
    let tx: TransactionResponse;

    setModal({
      open: MODAL_METAMASK_VALIDATE,
      data: { }
    });

    try {
      if (!isERC20Token(getErc20Iso3FromAddress(erc20Address))) {
        tx = await removeEth(user, heirAddress);
      } else {
        tx = await removeErc20Token(user, heirAddress, erc20Address);
      }
    } catch(error) {
      setModal({
        open: MODAL_ERROR,
        data: {
          text: 'We could not delete your '+ getErc20Iso3FromAddress(erc20Address) +' from your will',
          error: error,
        }
      });
      return;
    }

    setModal({
      open: MODAL_LOADING,
      data: {
        text: 'Removing your '+ getErc20Iso3FromAddress(erc20Address) +' from your will'
      }
    });

    await tx.wait(1);

    setWill(await getWill(user));

    setModal({
      open: MODAL_CONFIRMATION,
      data: {
        text: 'Your '+ getErc20Iso3FromAddress(erc20Address) +' has been successfully deleted from your will'
      }
    });
  };

  return (
    <>
      <Col css={styles.column}>
        {will && will.claims.length > 0 ?
          <>
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
                      {claim.allowance.lt(claim.balance) ?
                        <>
                          <Tooltip content={"This means we won't be able to transfer all your funds in case of your death. Please increase allowance."}>
                            <FaExclamationTriangle color="#f7ca18" size={20} style={{verticalAlign: 'middle'}}/>&nbsp;
                            <small>Allowance too low ({ethers.utils.formatEther(claim.allowance.sub(claim.balance))}) {getErc20Iso3FromAddress(claim.erc20Token)})</small>
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
                      <Row
                      justify="flex-start"
                       css={{margin: 0}}>
                        <Tooltip content={getErc20Iso3FromAddress(claim.erc20Token)}>
                        <Image
                          width={30}
                          src={getTokenImgFromAddress(claim.erc20Token)}
                        />
                      </Tooltip>
                      </Row>
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
                      {claim.allowance.lt(claim.balance) ?
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
          </>
        :
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You don't have any will yet
          </Text>

        }
      </Col>

      <MetamaskConfirmModal isOpened={modal.open == MODAL_METAMASK_VALIDATE} />
      <LoadingModal
        isOpened={modal.open == MODAL_LOADING}
        text={modal.data.text}
      />
      <ConfirmationModal
        isOpened={modal.open == MODAL_CONFIRMATION}
        onCloseModal={() => null}
        text={modal.data.text} />
      <ErrorModal
        isOpened={modal.open == MODAL_ERROR}
        onCloseModal={() => null}
        text={modal.data.text}
        error={modal.data.error}
      />
    </>
  )
}
