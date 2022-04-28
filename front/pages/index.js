import Head from 'next/head'
import { Button, Card, Container, Grid, Row, Col, Text, Spacer, Link } from "@nextui-org/react";
import { FaMoneyCheck, FaRegStickyNote } from 'react-icons/fa';

export default function Index() {

  return (
    <Container 
      fluid 
      responsive 
      css={{ 
        minHeight: '100vh', 
        minWidth: '100vw',  
        padding: '0', 
        background: '#fefefe'
      }}
    >
      <Head>
        <title>Inhetherit</title>
        <meta name="description" content="Find peace of mind. Bequeath your cryptos!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row 
        justify="center" 
        align="center" 
        css={{
          background: '#000',
          height: '4rem'
        }}
      >
        <Text 
          color="#ffffff"
        >
         <strong>REMINDER: </strong> Inhetherit was made during Chainlink Spring 22 Hackathon and is only available on testnet (for now)... 
        </Text>
      </Row>
      <Col 
        justify="center" 
        align="center" 
      >
        <Spacer y={3} />
        <Text 
          h1 size={50} 
          weight="bold"
        >
          Inhetherit 🌈  
        </Text>
        <Text 
          h2 
          size={100} 
          css={{
            textGradient: "90deg, #0700b8 0%, #00ff88 100%"
          }} 
          weight="bold"
        >
          Find peace of mind. 
        </Text>
        <Text 
          h3 
          size={20}
        >
          Your cryptos should <strong>never</strong> disappear when you die. <br/>Start bequeath your cryptos to your belove ones now!
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
              wrap="wrap"
            >
              <Card 
                hoverable 
                css={{
                  justifyContent : "center", 
                  alignItems:"center", 
                  padding: "2rem"
                }}
              >
                <Text 
                  h4 size={35} 
                  weight="bold"
                  css={{
                    textAlign: "center"
                  }}
                >
                  <FaRegStickyNote />
                  <br />
                  Make a will
                </Text>
                <Text 
                  size={18} 
                  css={{
                    paddingTop: "1rem", 
                    textAlign: "center"
                  }}
                >
                  Start bequeath your cryptos to your belove ones without compromising security! 
                </Text>
                <Card.Footer 
                  css={{
                    justifyContent: "center"
                  }}
                >
                  <Link 
                    href="/will"
                  >
                    <Button 
                      auto 
                      justify="center"
                    >
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
              wrap="wrap"
            >
              <Card 
                hoverable 
                css={{
                  justifyContent : "center", 
                  alignItems:"center", 
                  padding: "2rem"
                }}
              >
                <Text 
                  h4 
                  size={35} 
                  weight="bold"
                  css={{
                    textAlign: "center"
                  }}
                >
                  <FaMoneyCheck />
                  <br />
                  Claim a will
                </Text>
                <Text 
                  size={18} 
                  css={{
                    paddingTop: "1rem", 
                    textAlign: "center"
                  }}
                >
                  You lost someone who gave you their cryptos? Just get them back!
                </Text>
                <Card.Footer 
                  css={{
                    justifyContent: "center"
                  }}
                >
                  <Link 
                    href="/claim"
                  >
                    <Button 
                      auto
                    >
                      Get started
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
          background="#fefefe"
        >
          Powered by &nbsp;
          <Link 
            color="text"
          >
            Maître Yoda
          </Link>
          <Spacer w={5} />
          -
          <Spacer w={5} />
          <Link 
            color="text" 
            href="/faq"
          >
            FAQs
          </Link>
        </Row>
        <Spacer />
      </Col>
    </Container>
  )
}
