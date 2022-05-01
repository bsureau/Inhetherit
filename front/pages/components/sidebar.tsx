import { Link, Row, Col, Text, Spacer } from "@nextui-org/react";
import { FaMoneyCheck, FaRegStickyNote, FaQuestion, FaFile } from 'react-icons/fa';
import { useRouter, NextRouter } from "next/router";

const styles: any = {
  column: {
    position: "fixed",
    minHeight: '100vh',
    minWidth: "280px",
    width: "280px",
    background: "#054EA9",
    paddingTop: "1.5rem",
    borderTopRightRadius: "50px",
    zIndex: "100"
  },
  logo: {
    fontFamily: 'Avenir Next'
  },
  menuItem: {
    paddingLeft: "4em"
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
          h1 size={20}
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
            color={router.pathname == "/will" ? "#dedede" : "#ffffff"}
          >
            <FaRegStickyNote /> &nbsp;
            Make a will
          </Text>
        </Link>
      </Row>
      <Spacer y={1} />
      <Row
        css={styles.menuItem}
      >
        <Link
          color={"text"}
          href="/claim"
        >
          <Text
            size={17}
            weight="bold"
            color={router.pathname == "/claim" ? "#dedede" : "#ffffff"}
          >
            <FaMoneyCheck /> &nbsp;
            Make a claim
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
            href="/manifesto"
          >
            <Text
              size={17}
              weight="bold"
              color={router.pathname == "/manifesto" ? "#dedede" : "#ffffff"}
            >
              <FaFile /> &nbsp;
              Manifesto
            </Text>
          </Link>
        </Col>
      </Row>
    </Col>
  )
}
