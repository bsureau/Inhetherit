import { useEffect, useState } from "react";
import Head from 'next/head';
import { Loader, HeirWillList } from "./components";

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
import { getWills } from "../utils/willContract";
import { useWills } from "../context/wills";
import { useHeir } from "../context/heir";

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
  const { heir, setHeir } = useHeir();
  const { wills, setWills } = useWills();
  const [ loading, setLoading ] = useState(true);

  useEffect(function () {
    getWallet(window.ethereum)
      .then((heir) => {
        setHeir(heir);

        getWills(heir)
          .then((wills) => {
            setWills(wills);
          })
          .finally(() => {
            setLoading(false);
          });

        if (window.ethereum !== undefined) {
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setHeir({});
              setWills([]);
              return;
            }
            onConnectWallet();
          });
        }
      })
  }, []);

  const onConnectWallet = function () {
    connectWallet(window.ethereum)
      .then((heir) => {
        setHeir(heir);

        setLoading(true);
        getWills(heir)
          .then((wills) => {
            setWills(wills);
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
            { loading === true ?
              <Loader width={70} />
              :
              <Col 
                justify="center" 
                align="center" 
              >
                {heir.account ?
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
        </Col>
      </Row>
    </Container>
  )
}
