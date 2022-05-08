import {Modal, Text} from "@nextui-org/react";
import {FaCheck} from "react-icons/fa";
import React from "react";

export function ConfirmationModal ({
  isOpened,
  onCloseModal,
  text,
}) {
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
          All good
        </Text>
        {text}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}