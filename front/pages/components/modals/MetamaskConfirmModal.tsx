import {Modal, Text} from "@nextui-org/react";
import React from "react";

export function MetamaskConfirmModal ({
  isOpened,
}) {
  return (
    <Modal
      preventClose={true}
      aria-labelledby="modal-title"
      width="600px"
      open={isOpened}
    >
      <Modal.Header>
        <Text id="modal-title" size={30}>
          Confirm the transaction
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text>
          You need to confirm the transaction using metamask
        </Text>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}