import { useEffect } from "react";
import Head from 'next/head';
import {
  Container,
  Row,
  Col,
  Spacer
} from "@nextui-org/react";

import {
  TopBar,
  Sidebar,
  WillForm,
  WillList
} from './components';

import { getWallet } from "../utils/metamask";
import { useUser } from "../context/user";

const styles: any = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    padding: '0',
    zIndex: "-10"
  },
  column: {
    marginLeft: "280px",
    paddingTop: "5.3rem",
    background: "#fefefe",
    minHeight: "100vh",
    textAlign: "center",
    width: "100%",
  },
};

export default function Will() {
  const { user, setUser } = useUser();

  useEffect(function () {
    getWallet(window.ethereum).then((user) => {
      setUser(user);

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setUser({});
        }
      });
    })
  }, []);

  return (
    <Container 
      fluid 
      responsive 
      css={styles.container}
    >
      <Head>
        <title>Inhetherit - Create a will</title>
      </Head>
      
      <TopBar />
      <Sidebar />
      <Row 
        justify="center"
        align="center"
      >
        <Col 
          justify="center" 
          align="center" 
          css={styles.column}
        >
          <Spacer y={3} />
          <Col
            justify="center"
            align="center"
          >
            {user.account ?
              <>
                <Row>
                  <WillForm />
                </Row>
                <Row>
                  <WillList />
                </Row>
              </>
            :
              <Row>Please connect your wallet first...</Row>
            }
          </Col>
        </Col>
      </Row>
    </Container>
  )
}