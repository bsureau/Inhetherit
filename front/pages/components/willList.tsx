import React from 'react';
import { Col, Row, Text } from '@nextui-org/react';

const styles = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "3rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0"
  },
  row: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    textAlign: "left",
    padding: "3rem"
  },
}

export default function WillList() {

  return (
    <Col css={styles.column}>
      <Row
        justify="center"
        css={styles.row}
      >
        <Text color="#b0b0b0">
          NO WILL FOUND ON THIS ADDRESS...
        </Text>
      </Row> 
    </Col>
  )
}
