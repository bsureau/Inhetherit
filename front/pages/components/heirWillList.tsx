import React from 'react';
import { Button, Card, Col, Link, Text, Row, Grid } from '@nextui-org/react';
import { FaRainbow, FaMoneyCheck } from 'react-icons/fa';

import { willABI } from '../../utils/willContract';
import { useHeirWills } from '../../context/heirWills';
import { useUser } from "../../context/user";
import {Contract, ethers} from "ethers";
import {getErc20Iso3FromAddress, getTokenImgFromAddress} from "../../utils/erc20Contract";

const styles: any = {
  column: {
    width: "85%",
    minWidth: "1000px",
    margin: "auto",
    borderRadius: "1rem",
    background: "#ffffff",
    marginTop: "1rem",
    marginBottom: "2rem",
    boxShadow: "0px 0.2rem 10px #e0e0e0",
    padding: "3rem 2rem"
  },
  row: {
    marginTop: 20,
  },
  icon: {
    verticalAlign: "middle",
    marginRight: 10,
  },
  fieldName: {
    fontWeight: 700,
  },
  tokensContainer: {
    marginTop: 10,
    flexWrap: "wrap",
  },
  tokenContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center"
  }, 
  card: {
    width: "200px"
  }
}

export default function HeirWillList() {
  const { heirWills } = useHeirWills();
  const { user } = useUser();

  const reportDeath = async (willAddress: string) => {

    //TODO:
    //1. première modale qui demande à l'héritier de confirmer la mort en saisissant la date de mort au format JJ/MM/AAAA 
    //2. call de will.reportDeath(deathDate). Gérer les erreurs (mettre un message générique et demander de vérifier si il y a assez de link sur le contrat, sinon l'user doit en envoyer 0.05LINK)
    //3. chargement... (la requête est partie du smart contract au réseau chainlink. On attend que Chainlink nous renvoie la réponse)
    //4. la callback est appelée par Chainlink dans le contrat. Le contrat envoie un event DeathReport(boolean) auquel il faut s'abonner
    //5. si l'event renvoie false, c'est que le giver n'a pas été trouvé dans l'API -> on renvoie un message d'erreur dans la modale
    //6. si le giver apparaît, on charge une nouvelle modale dans laquelle on propose à l'utilisateur d'enchainer avec le transfer des fonds (voir méthode claimFunds ci-dessous)

    const deathDate: string = window.prompt("Please enter death date using JJ/MM/AAAA format: ")
    const contract: Contract = new ethers.Contract(willAddress, willABI, user.signer);

    await contract.reportDeath(deathDate);

    contract.on("DeathReport", (result: boolean, event: object) => {

      if(result === false) {
          alert("Giver not found in death records");
        } else {
          alert("Giver found in death records. Continue to claim funds");
          claimFunds(willAddress);
        }
    });    
  }

  const claimFunds = async (willAddress: string) => {
    //TODO:
    //1. Appel de la méthode du contrat will.claimFunds()
    //2. message de confirmation avec un lien du hash de la tx sur rinkeby.etherscan.io
    const contract: Contract = new ethers.Contract(willAddress, willABI, user.signer);
    console.log(await contract.getClaims());
    await contract.claimFunds();

    alert("All good, funds transfered!")
  }
  
  return (
    <>
      {heirWills && heirWills.length > 0 ?
        <Col>
          {heirWills.map((will) => (
            <Row css={styles.column} key={will.address}>
              <Col align="center" justify="center">
                <Row>
                  <Grid xs={6}>
                    <Text weight="bold">Will contract: &nbsp;</Text>
                    <Link
                      href={`https://rinkeby.etherscan.io/address/${will.address}`}
                      target="_blank"
                    >
                      {will.address}
                    </Link>
                  </Grid>
                  <Grid xs={3} css={{position: "absolute", right: 0}}>
                    {will.state == 0 ? (
                      <Button bordered size="lg" onClick={() => { reportDeath(will.address)} }>
                        <FaRainbow size={20} style={styles.icon}/> Report death
                      </Button>
                      ) : 
                      <Button bordered size="lg" onClick={() => { claimFunds(will.address)} }>
                        <FaMoneyCheck size={20} style={styles.icon}/> Claim funds
                      </Button>
                    }
                  </Grid>
                </Row>
                <Row style={styles.row}>
                  <Grid xs={5}>
                    <Col>
                      <Row><Text style={styles.fieldName}>From: </Text></Row>
                      <Row><Text>
                        {will.firstName} {will.lastName} &nbsp;
                        {`<`}
                        <Link href={`https://rinkeby.etherscan.io/address/${will.giverAddress}`} target="_blank">
                          {will.giverAddress.substring(0,25)}...
                        </Link>
                        {`>`}
                      </Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={styles.fieldName}>Birthday: </Text></Row>
                      <Row><Text>{will.birthdate}</Text></Row>
                    </Col>
                  </Grid>
                  <Grid xs={3}>
                    <Col>
                      <Row><Text style={styles.fieldName}>Birth Postcode: </Text></Row>
                      <Row><Text>{will.postCode}</Text></Row>
                    </Col>
                  </Grid>
                </Row>
                <Row style={styles.row}>
                  <Text style={styles.fieldName}>You will receive: </Text>
                </Row>
                <Row justify="flex-start" align="center" css={styles.tokensContainer}>
                  <Grid.Container gap={2}>
                    {will.claims.map((claim) => (
                      <Grid xs={3} key={claim.address}>
                        <Card bordered shadow={false} css={styles.card}>
                          <Row css={styles.tokenContent}>
                            <img src={getTokenImgFromAddress(claim.tokenAddress)} width="30px"/> &nbsp;&nbsp;&nbsp;
                            <Text>{ethers.utils.formatEther(claim.balance)} {getErc20Iso3FromAddress(claim.tokenAddress)}</Text></Row>
                        </Card>
                      </Grid>
                      )
                    )}
                  </Grid.Container>
                </Row>
              </Col>
            </Row>
          ))}
        </Col>
      :
        <Col css={{padding: "3rem 2rem", boxShadow: "0px 0.2rem 10px #e0e0e0", width: "85%", minWidth: "1000px", margin: "auto", borderRadius: "1rem", background: "#ffffff" }}>
          <Text css={{ color: '#888', fontWeight: 500 }}>
            You're not listed in any will yet
          </Text>
        </Col>
      }
    </>
  )
}
