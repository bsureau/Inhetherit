import { Modal, Text, Link } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import React from "react";

export function FundsTransferedModal ({
  isOpened,
  address,
}) {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="600px"
      open={isOpened}
    >
      <Modal.Header></Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center" }}>
            <FaCheck size={80} color="#16a085" style={{ display: "inline-block" }} />
          </span>
        <Text size={30}>
          All good
        </Text>
        <Text style={{ marginTop: 10 }}>
          The funds you claimed have been transferred to your wallet. <br/>{"<"}
          <Link href={"https://rinkeby.etherscan.io/address/"+ address} target="_blank" >
            {address}
          </Link>
          {">"}
        </Text>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
