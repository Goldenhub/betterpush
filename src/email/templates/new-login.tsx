import { Body, Button, Column, Container, Head, Heading, Html, Img, Preview, Row, Section, Text } from "@react-email/components";

export interface LoginEmailProps {
  username?: string;
  loginDate?: string;
  userAgent?: string;
  ip?: string;
}

const baseUrl = process.env.BASE_URL;

export const LoginEmail = ({ username, loginDate, userAgent, ip }: LoginEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>BetterPush recent login</Preview>
        <Container>
          <Section style={logo}>
            <Img src={`${baseUrl}/logo.png`} alt="BetterPush logo" />
          </Section>

          <Section style={content}>
            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {username},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  We noticed a recent login to your BetterPush account.
                </Heading>

                <Text style={paragraph}>
                  <b>Time: </b>
                  {loginDate}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>User-Agent: </b>
                  {userAgent}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>IP Address: </b>
                  {ip}
                </Text>

                <Text style={paragraph}>If this was you, there's nothing else you need to do.</Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>If this wasn't you or if you have additional questions, please see our support page.</Text>
              </Column>
            </Row>
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
            }}
          >
            © 2025 | BetterPush
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default LoginEmail;

const main = {
  backgroundColor: "#fff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const logo = {
  padding: "30px 20px",
};

const buttonContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#e00707",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  display: "inline-block",
  padding: "12px 30px",
  textDecoration: "none",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};
