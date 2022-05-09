import React, {useEffect, useState} from 'react';
import { Button, Col, Link, Row, StyledHelperTextContainer, Table, Text, Tooltip } from '@nextui-org/react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { useWill } from "../../context/will";
import { useUser } from "../../context/user";
import { useModal } from "../../context/modal";

import {
  getErc20Iso3FromAddress,
  erc20Abi,
  maxUINT256, isERC20Token
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
  return await erc20Contract.approve(will.address, maxUINT256); //replace value by max uint256 value
}

export default function HeirWillList() {
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
      if (!isERC20Token(erc20Address)) {
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
                <Table.Column>Giver</Table.Column>
                <Table.Column>Will contract</Table.Column>
                <Table.Column></Table.Column>
              </Table.Header>
              <Table.Body>
                {wills.claims.map((will) => (
                  <Table.Row key={will.address}>
                    <Table.Cell>
                      Status (Funds to claim/Funds transfered)
                    </Table.Cell>
                    <Table.Cell>
                      will.giver
                    </Table.Cell>
                    <Table.Cell>
                      will.address
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => onIncreaseAllowance(claim.erc20Token)}>Details</Button>
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
