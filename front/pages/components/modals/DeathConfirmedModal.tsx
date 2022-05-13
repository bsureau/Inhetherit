import {Button, Col, Input, Link, Modal, Spacer, Text} from "@nextui-org/react";
import {FaCheck} from "react-icons/fa";
import React from "react";

export function DeathConfirmedModal ({
  isOpened,
  onCloseModal,
  onTransferfunds,
  willAddress,
}) {

  const onClickTransferFunds = () => {
    onTransferfunds(willAddress);
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="600px"
      open={isOpened}
      onClose={onCloseModal}
    >
      <Modal.Header></Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center" }}>
            <FaCheck size={80} color="#16a085" style={{ display: "inline-block" }} />
          </span>
        <Text size={30}>
          Death confirmed
        </Text>
        <Text style={{ marginTop: 10 }}>
          The funds have been unlocked, you can now transfer them to your wallet.
        </Text>
        <Spacer y={2}/>
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={onClickTransferFunds}>
          Transfer funds now
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
