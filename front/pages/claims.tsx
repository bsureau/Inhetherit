import {useCallback, useEffect, useState} from "react";
import Head from 'next/head';
import { Button, Container, Row, Col, Spacer } from "@nextui-org/react";

import { Loader, HeirWillList } from "../components";
import { TopBar, Sidebar } from '../components';

import { connectWallet, getWallet } from "../utils/metamask";
import { getHeirWills } from "../utils/willContract";

import { useHeirWills } from "../context/heirWills";
import { useUser } from "../context/user";
import { ModalProvider } from "../context/modal";

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

export default function Claims() {
  const { user, setUser } = useUser();
  const { setHeirWills } = useHeirWills();
  const [ loading, setLoading ] = useState(true);

  /* eslint-disable */
  useEffect(function () {
    getWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        getHeirWills(user)
          .then((wills) => {
            setHeirWills(wills);
          })
          .finally(() => {
            setLoading(false);
          });

        if (window.ethereum !== undefined) {
          /** @ts-ignore **/
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setUser({});
              setHeirWills([]);
              return;
            }
            onConnectWallet();
          });
        }
      })
  }, []);

  const onConnectWallet = function () {
    connectWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        setLoading(true);
        getHeirWills(user)
          .then((wills) => {
            setHeirWills(wills);
          })
          .finally(() => {
            setLoading(false);
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
        <title>Inhetherit - Your claims</title>
      </Head>
      
      <TopBar onConnectWallet={onConnectWallet} />
      <Sidebar />
      <Row 
        justify="center"
        align="center"
      > 
        <Col
          css={styles.column}
        >
          <Spacer y={3} />
            { loading === true ?
              <Loader width={70} />
              :
              <Col>
                {user.account ?
                  <>
                    <Row>
                      <ModalProvider>
                        <HeirWillList />
                      </ModalProvider>
                    </Row>
                  </>
                  :
                  <Col>
                    <Row justify="center" align="center" style={{ marginBottom: 10 }}>
                      <h3>Please connect your wallet first...</h3>
                    </Row>
                    <Row justify="center" align="center">
                      <Button bordered onClick={onConnectWallet}>Connect with Metamask</Button>
                    </Row>
                  </Col>
                }
              </Col>
            }
        </Col>
      </Row>
    </Container>
  )
}
