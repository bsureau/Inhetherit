import {Button, Col, Link, Modal, Spacer, Text} from "@nextui-org/react";
import React from "react";

import { useWill } from "../../../context/will";
import { isERC20Token } from "../../../utils/erc20Contract";

export function ReviewModal ({
  isOpened,
  onCloseModal,
  handleWill,
  formData,
}) {
  const { will } = useWill();

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="600px"
      open={isOpened}
      onClose={onCloseModal}
    >
      <Modal.Header>
        <Text id="modal-title" size={30}>
          Review your will
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Col justify="center" align="center">
          <Text>
            {isERC20Token(formData.token) ?
              `You are about to give the right to transfer all your ${formData.token} funds to your heir.`
            :
              `You are about to give ${formData.tokenToTransfer} ${formData.token} to your heir.`
            }
            <br />
            {will ?
              `Make sure the address of your heir is the right one before confirming.`
              :
              `Please make sure all the informations are correct or your funds could never be transferred at the time of your death.`
            }
          </Text>
          <Spacer />
          {!will ?
            <>
              <Text>
                <strong>First name:</strong>
                <br/>
                {formData.firstName}
              </Text>
              <Spacer/>
              <Text>
                <strong>Last name:</strong>
                <br/>
                {formData.lastName}
              </Text>
              <Spacer/>
              <Text>
                <strong>Birthday date:</strong>
                <br/>
                {formData.birthday}
              </Text>
              <Spacer/>
              <Text>
                <strong>Birth postal code:</strong>
                <br/>
                {formData.birthPostCode}
              </Text>
              <Spacer />
            </>
            :
            <>
              <Text>
                <strong>Your will contract:</strong>
                <br/>
                <Link
                  href={`https://rinkeby.etherscan.io/search?f=1&q=${will.address}`}
                  target="_blank"
                >
                  {will.address}
                </Link>
              </Text>
              <Spacer/>
            </>
          }
          <Text>
            <strong>Heir address:</strong>
            <br />
            <Link
              href={`https://rinkeby.etherscan.io/search?f=1&q=${formData.heirAddress}`}
              target="_blank"
            >
              {formData.heirAddress}
            </Link>
          </Text>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={handleWill}>
          Confirm {will ? `token transfer` : `will creation`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}