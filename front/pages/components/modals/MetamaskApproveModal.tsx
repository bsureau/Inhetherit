import {Button, Col, Link, Modal, Spacer, Text} from "@nextui-org/react";
import React from "react";

export function MetamaskApproveModal ({
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
          Last step
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text>
          You must now approve transfer of your token by your will smart contract
        </Text>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}