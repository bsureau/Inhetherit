import { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader, HeirWillList } from "../components";

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
} from '../components';

import { connectWallet, getWallet } from "../../utils/metamask";
import { getWills } from "../../utils/willContract";
import { useWills } from "../../context/wills";
import { useUser } from "../../context/user";

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

export default function Claim() {
  const { user, setUser } = useUser();
  const { wills, setWills } = useWills();
  const [ loading, setLoading ] = useState(true);
  const router = useRouter()


  useEffect(function () {
    getWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        getWills(user)
          .then((wills) => {
            setWills(wills);
          })
          .finally(() => {
            setLoading(false);
          });

        if (window.ethereum !== undefined) {
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setUser({});
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
      .then((user) => {
        setUser(user);

        setLoading(true);
        getWills(user)
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
        <title>Inhetherit - Your claim {router.query.address}</title>
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
                TOTO
              </Col>
            }
        </Col>
      </Row>
    </Container>
  )
}
