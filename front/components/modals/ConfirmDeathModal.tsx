import React, { useState } from "react";
import {Button, Col, Input, Link, Modal, Spacer, Text} from "@nextui-org/react";

export function ConfirmDeathModal ({
  isOpened,
  onCloseModal,
  onConfirmDeath,
  willAddress,
}) {
  const [deathDate, setDeathDate] = useState('');

  const onClickConfirmDeath = function () {
    onConfirmDeath(willAddress, deathDate);
    setDeathDate(null);
  }

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
          Confirm the death report
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Col style={{ textAlign: 'center' }}>
          <Text>
            We are sorry for your loss. <br/>
            In order to unlock the funds, please fill the date of death.
          </Text>
          <Spacer />
          <Input
            rounded
            bordered
            label="Date of death:"
            placeholder="DD/MM/YYYY"
            color="primary"
            width="30%"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
          />
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={onClickConfirmDeath}>
          Confirm death report
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
