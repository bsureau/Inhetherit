import { useEffect, useState } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader } from "../components";

import {
  Button,
  Container,
  Row,
  Col,
  Spacer, 
  Table
} from "@nextui-org/react";

import {
  TopBar,
  Sidebar
} from '../components';

import { connectWallet, getWallet } from "../../utils/metamask";
import { getClaimsForHeir } from "../../utils/willContract";
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
  column2: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "1rem",
    marginBottom: "1rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    padding: "0rem 0 0rem 0"
  },
};

export default function Claim() {
  const { user, setUser } = useUser();
  const [ claims, setClaims ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const router = useRouter()


  useEffect(function () {
    getWallet(window.ethereum)
      .then((user) => {
        setUser(user);

        getClaimsForHeir(user, router.query.address)
          .then(claims => {
            setClaims(claims);
            claims.map((claim) => {

              // ici on récupère l'adresse du token. Il faut : récupérer le symbole... depuis le json en config. Puis faire un call de claim.balanceOf(giver)
            })
          })
          .finally(() => {
            setLoading(false);
          });

        if (window.ethereum !== undefined) {
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setUser({});
              setClaims([]);
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
        getClaimsForHeir(user, router.query.address)
          .then((claims) => {
            setClaims(claims);
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
              <>
                <Spacer y={2}/>
                <Row>
                  <Col css={styles.column2}>
                    <>
                      <Table lined css={{
                        height: "auto",
                        minWidth: "100%",
                      }}>
                        <Table.Header>
                          <Table.Column>Token</Table.Column>
                          <Table.Column>Amount</Table.Column>
                          <Table.Column></Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {claims.map((claim) => (
                            <Table.Row key={claim}>
                              <Table.Cell>
                                  {claim}
                              </Table.Cell>
                              <Table.Cell>
                              
                              </Table.Cell>
                              <Table.Cell>
                              
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </>
                  </Col>
                </Row>
              </>
            </Col>
          }
        </Col>
      </Row>
    </Container>
  )
}
