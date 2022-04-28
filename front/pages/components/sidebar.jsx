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
          paddingTop: "1rem", 
          borderRadius: "0 3.8rem 0 0", 
          zIndex: "100"
        }}
      >
        <Link 
          color="text" 
          href="/"
        >
          <Text 
            h1 
            size={35} 
            weight="bold" 
            color="#ffffff"
          >
            Inhetherit 🌈 
          </Text>
        </Link>
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
              size={18} 
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
              size={18} 
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
              size={18} 
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
