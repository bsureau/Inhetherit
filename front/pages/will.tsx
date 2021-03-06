import { useEffect, useState } from "react";
import Head from 'next/head';
import { Container, Row, Col, Spacer, Button } from "@nextui-org/react";
import { TopBar, Sidebar, WillAddress, WillForm, WillList, Loader } from '../components';
import { connectWallet, getWallet } from "../utils/metamask";
import { getWill } from "../utils/willContract";
import { useUser } from "../context/user";
import { useWill } from "../context/will";
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

export default function Will() {
  const { user, setUser } = useUser();
  const { will, setWill } = useWill();
  const [ loading, setLoading ] = useState(true);

  /* eslint-disable */
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

        if (window.ethereum !== undefined) {
          /** @ts-ignore **/
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setUser({});
              setWill(undefined);
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
        getWill(user)
          .then((will) => {
            setWill(will);
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
        <title>Inhetherit - Create a will</title>
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
          {loading === true ?
            <Loader width={70} />
            :
            <Col>
              <ModalProvider>
                {user.account ?
                  <>
                    <Row>
                      <WillAddress will={will} />
                    </Row>
                    <Spacer />
                    <Row>
                      <WillForm/>
                    </Row>
                    <Spacer y={2}/>
                    <Row>
                      <WillList/>
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
              </ModalProvider>
            </Col>
          }
        </Col>
      </Row>
    </Container>
  )
}
