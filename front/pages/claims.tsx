import { useEffect, useState } from "react";
import Head from 'next/head';
import { Loader, HeirWillList } from "./components";
import { ModalProvider } from "../context/modal";

import {
  Button,
  Container,
  Row,
  Col,
  Spacer
} from "@nextui-org/react";

import {
  TopBar,
  Sidebar
} from './components';

import { connectWallet, getWallet } from "../utils/metamask";
import { getWill } from "../utils/willContract";
import { useGiver } from "../context/giver";
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

export default function Claims() {
  const { giver, setGiver } = useGiver();
  const { will, setWill } = useWill();
  const [ loading, setLoading ] = useState(true);

  useEffect(function () {
    getWallet(window.ethereum)
      .then((giver) => {
        setGiver(giver);

        getWill(giver)
          .then((will) => {
            setWill(will);
          })
          .finally(() => {
            setLoading(false);
          });

        if (window.ethereum !== undefined) {
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setGiver({});
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
      .then((giver) => {
        setGiver(giver);

        setLoading(true);
        getWill(giver)
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
        <title>Inhetherit - Your claims</title>
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
          <ModalProvider>
            { loading === true ?
              <Loader width={70} />
              :
              <Col 
                justify="center" 
                align="center" 
              >
                {giver.account ?
                  <>
                    <Spacer y={2}/>
                    <Row>
                      <HeirWillList />
                    </Row>
                  </>
                  :
                  <Col>
                    <h3>Please connect your wallet first...</h3><br/>
                    <Button bordered onClick={onConnectWallet}>Connect with Metamask</Button>
                  </Col>
                }
              </Col>
            }
          </ModalProvider>
        </Col>
      </Row>
    </Container>
  )
}
