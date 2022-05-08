import {Modal, Text} from "@nextui-org/react";
import React from "react";
import Loader from "../loader";

export function LoadingModal ({
  isOpened,
  text,
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
          <Loader width={70} />
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text style={{ textAlign: 'center' }}>
          {text}
        </Text>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}