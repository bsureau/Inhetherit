import { useEffect, useState } from "react";
import Head from 'next/head';
import {
  Container,
  Row,
  Col,
  Spacer,
  Text
} from "@nextui-org/react";

import {
  TopBar,
  Sidebar,
  WillForm,
  WillList
} from './components';

import { connectWallet, getWallet } from "../utils/metamask";
import { getWill } from "../utils/willContract";
import { useUser } from "../context/user";
import { useWill } from "../context/will";

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
  const { setWill } = useWill();
  const [ loading, setLoading ] = useState(true);

  useEffect(function () {
    getWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        getWill(user)
          .then((will) => {
            setWill(will);
          })
          .finally(() => {
            setLoading(false);
          });

        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            setUser({});
            setWill(undefined);
          }
        });
      })
  }, []);

  const onConnectWallet = function () {
    connectWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        getWill(user)
          .then((will) => {
            setWill(will);
          })
      })
  }

  return (
    <Container 
      fluid 
      responsive 
      css={styles.container}
    >
      <Head>
        <title>Inhetherit - Create a will</title>
      </Head>
      
      <TopBar onConnectWallet={onConnectWallet} />
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
          {loading === true ?
            <>
              <Text h3>Loading...</Text>
            </>
            :
            <Col
              justify="center"
              align="center"
            >
              {user.account ?
                <>
                  <Row>
                    <WillForm/>
                  </Row>
                  <Row>
                    <WillList/>
                  </Row>
                </>
                :
                <Row><Text h3>Please connect your wallet first...</Text></Row>
              }
            </Col>
          }
        </Col>
      </Row>
    </Container>
  )
}