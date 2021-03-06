import Head from 'next/head'
import { Button, Card, Container, Grid, Row, Col, Text, Spacer, Link } from "@nextui-org/react";
import { FaMoneyCheck, FaRegStickyNote } from 'react-icons/fa';

const styles: any = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    padding: '0',
    background: '#fefefe'
  },
  row: {
    background: 'rgb(5, 78, 169)',
    height: '4rem'
  },
  logo: {
    fontFamily: 'Avenir Next'
  },
  title: {
    textGradient: "90deg, rgb(5, 78, 169) 30%, #00ff88 100%"
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem"
  },
  cardTitle: {
    textAlign: "center"
  },
  cardText: {
    paddingTop: "1rem",
    textAlign: "center"
  },
  cardFooter: {
    justifyContent: "center"
  },
};

export default function Index() {

  return (
    <Container 
      fluid 
      responsive 
      css={styles.container}
    >
      <Head>
        <title>Inhetherit - Find peace of mind. Pass on your cryptos!</title>
      </Head>
      <Row 
        justify="center" 
        align="center" 
        css={styles.row}
      >
        <Text 
          color="#ffffff"
        >
         <strong>REMINDER: </strong> Inhetherit was made during Chainlink Spring 22 Hackathon and is only available on testnet... 
        </Text>
      </Row>
      <Col style={{ textAlign: "center" }} >
        <Spacer y={3} />
        <Text
          h1 size={25}
          weight="bold"
          css={styles.logo}
        >
          🌈 &nbsp;INHETHERIT
        </Text>
        <Text
          h2
          size={100}
          css={styles.title}
          weight="bold"
        >
          Find peace of mind.
        </Text>
        <Text h3 size={20}>
          Your cryptos should <strong>never</strong> disappear when you die. <br />
          Plan to pass on your cryptos to your loved ones!
        </Text>
        <Spacer y={2} />
        <Row 
          justify="center" 
          align="center"
        >
          <Grid.Container 
            gap={2} 
            justify="center"
          >
            <Grid 
              xs={10} 
              md={3} 
              justify="center"
            >
              <Card hoverable css={styles.card}>
                <Text 
                  h4 size={35} 
                  weight="bold"
                  css={styles.cardTitle}
                >
                  <FaRegStickyNote />
                  <br />
                  Make a will
                </Text>
                <Text 
                  size={18} 
                  css={styles.cardText}
                >
                  Pass on your cryptos to your loved ones without compromising security! 
                </Text>
                <Card.Footer css={styles.cardFooter}>
                  <Link href="/will">
                    <Button auto>
                      Get started
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Grid>
            <Grid 
              xs={10} 
              md={3} 
              justify="center"
            >
              <Card hoverable css={styles.card}>
                <Text 
                  h4 
                  size={35} 
                  weight="bold"
                  css={styles.cardTitle}
                >
                  <FaMoneyCheck />
                  <br />
                  Claim a will
                </Text>
                <Text 
                  size={18} 
                  css={styles.cardText}
                >
                  You lost someone who gave you their cryptos? 
                </Text>
                <Card.Footer css={styles.cardFooter}>
                  <Link href="/claims">
                    <Button auto>
                      Claim it now
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Grid>
          </Grid.Container>
        </Row>
        <Spacer />
        <Row 
          justify="center" 
          align="center"
          style={{ marginTop: "10px" }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            color="text"
            href="https://github.com/bsureau/chainlink-hackathon"
            target="_blank"
          >
            Manifesto
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp;
        </Row>
        <Spacer />
        <Spacer />
        <Row
          justify="center"
          align="center"
          style={{ marginTop: "10px" }}
        >
          Made in 🇫🇷 by&nbsp;
          <Link href="https://github.com/bsureau" target="_blank">@bsureau</Link>&nbsp;&&nbsp;
          <Link href="https://github.com/romainjeff" target="_blank">@romainjeff</Link>
        </Row>
        <Spacer />
      </Col>
    </Container>
  )
}
