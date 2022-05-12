import { Modal, Text } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import React from "react";

export function ErrorModal ({
  isOpened,
  onCloseModal,
  text,
  error
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
            <FaTimes size={80} color="#96281b" style={{ display: "inline-block" }} />
          </span>
        <Text size={30}>
          Oh no! Something went wrong...
        </Text>

        <Text style={{ marginTop: 5 }}>
          {text}
        </Text>

        {error ? (
            <>
              <Text size={13} style={{ marginTop: 20, marginBottom: 5, textAlign: 'left' }}>More details</Text>
              <code>{error.message}</code>
            </>
          ) : ''
        }
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
