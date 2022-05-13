import { Link, Row, Col, Text, Spacer } from "@nextui-org/react";
import { FaMoneyCheck, FaRegStickyNote, FaFile } from 'react-icons/fa';
import { useRouter, NextRouter } from "next/router";

const styles: any = {
  column: {
    position: "fixed",
    minHeight: '100vh',
    minWidth: "280px",
    width: "280px",
    background: "#054EA9",
    paddingTop: "1.5rem",
    borderTopRightRadius: "30px",
    zIndex: "100"
  },
  logo: {
    fontFamily: 'Avenir Next'
  },
  menuItem: {
    paddingLeft: "4em"
  },
  menuText: {
    color: "#dedede",
  },
  menuSelectedText: {
    textDecoration: "underline",
    color: "#ffffff",
  },
  menuFooter: {
    position: "absolute",
    bottom: "4rem",
    marginLeft: "4rem",
    flexDirection: "column",
  },
  menuFooterItem: {
    paddingBottom: "10px",
  },
  icon: {
    marginRight: 10,
    verticalAlign: 'middle',
  }
}

export default function Sidebar() {

  const router: NextRouter = useRouter();

  return (
    <Col
      align="center"
      css={styles.column}
    >
      <Link href="/">
        <Text
          h1 size={23}
          color="white"
          weight="bold"
          css={styles.logo}
        >
          🌈 &nbsp;INHETHERIT {"\n"}
        </Text>
      </Link>
      <Text
        size={13}
        color="white"
      >
        Find peace of mind.
      </Text>
      <Spacer y={3} />
      <Row
        css={styles.menuItem}
      >
        <Link
          color="text"
          href="/will"
        >
          <Text
            size={17}
            weight="bold"
            style={router.pathname == "/will" ? styles.menuSelectedText : styles.menuText }
          >
            <FaRegStickyNote style={styles.icon} />
            My will
          </Text>
        </Link>
      </Row>
      <Spacer y={1} />
      <Row
        css={styles.menuItem}
      >
        <Link
          color={"text"}
          href="/claims"
        >
          <Text
            size={17}
            weight="bold"
            style={router.pathname == "/claims" ? styles.menuSelectedText : styles.menuText }
          >
            <FaMoneyCheck style={styles.icon} />
            My claims
          </Text>
        </Link>
      </Row>
      <Spacer y={4} />
      <Row
        css={styles.menuFooter}
      >
        <Col
          align="left"
          css={styles.menuFooterItem}
        >          
          <Link
            color="text"
            href="https://github.com/bsureau/chainlink-hackathon"
            target="_blank"
          >
            <Text
              size={17}
              weight="600"
              style={router.pathname == "/manifesto" ? styles.menuSelectedText : styles.menuText }
            >
              <FaFile style={styles.icon} />
              Manifesto
            </Text>
          </Link>
        </Col>
      </Row>
    </Col>
  )
}
