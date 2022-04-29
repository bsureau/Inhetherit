import { Link, Row, Col, Text, Spacer } from "@nextui-org/react";
import { FaMoneyCheck, FaRegStickyNote, FaQuestion } from 'react-icons/fa';
import { useRouter } from "next/router";

export default function Sidebar() {

  const router = useRouter();

  return (
      <Col 
        align="center" 
        css={{ 
          position: "fixed", 
          minHeight: '100vh', 
          minWidth: "280px",  
          width: "280px", 
          background: "#054EA9", 
          paddingTop: "1.5rem", 
          borderTopRightRadius: "50px",
          zIndex: "100"
        }}
      >
        <Link 
          href="/"
        >
          <Text 
            h1 size={20} 
            color="white"
            weight="bold"
            css={{
              fontFamily: 'Avenir Next'
            }}
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
          css={{
            paddingLeft: "4em"
          }}
        >
          <Link 
            color="text"
            href="/will"
          >
            <Text 
              size={17} 
              weight="bold" 
              color= { router.pathname == "/will" ? "#dedede" : "#ffffff"}
            >
              <FaRegStickyNote /> &nbsp;
              Make a will
            </Text>
          </Link>
        </Row>
        <Spacer y={1} />
        <Row 
          css={{
            paddingLeft: "4rem"
          }}
        >
          <Link 
            color={"text"}
            href="/claim"
          >
            <Text 
              size={17} 
              weight="bold" 
              color= { router.pathname == "/claim" ? "#dedede" : "#ffffff"}
            >
             <FaMoneyCheck /> &nbsp;
             Make a claim
            </Text>
          </Link>
        </Row>
        <Spacer y={4} />
        <Row 
          css={{
            position: "absolute", 
            bottom: "4rem", 
            paddingLeft: "4rem", 
          }}
        >
          <Link 
            color="text" 
            href="/faq"
          >
            <Text 
              size={17} 
              weight="bold" 
              color= { router.pathname == "/faq" ? "#dedede" : "#ffffff"}
            >
              <FaQuestion /> &nbsp;
              FAQs
            </Text>
          </Link>
        </Row>
      </Col>
  )
}
