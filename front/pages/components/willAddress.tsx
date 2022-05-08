
import React from 'react';
import {Col, Link, Row, Text} from '@nextui-org/react';

export default function WillAddress ({ will }) {
  return (
    <Col
        css={{
        width: "85%",
        minWidth: "1000px",
        margin: "auto",
        borderRadius: "1rem",
        background: "#ffffff",
        }}
    >
      <Row css={{
        justifyContent: "flex-start",
        textAlign:"left",
        padding: "1rem 1rem 1rem"
      }}>
        { will ?
          <Text css={{ display: 'block', color: 'grey'}}><strong>Your will address: </strong><Link href={`https://rinkeby.etherscan.io/address/${will.address}`} target="_blank">{will.address}</Link></Text>
          : ''
        }
        </Row>
    </Col>
  );
}
