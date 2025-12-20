import { Body, Column, Container, Head, Html, Img, Link, Preview, Row, Section, Text } from "@react-email/components";

export interface SuccessfulPasswordResetEmailProps {
  username?: string;
  updatedDate?: string;
}

const baseUrl = process.env.BASE_URL;

export const SuccessfulPasswordResetEmail = ({ username, updatedDate }: SuccessfulPasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>You updated the password for your BetterPush account</Preview>
        <Container style={container}>
          <Section style={logo}>
            <Img width={114} src={`${baseUrl}/betterpush-logo.png`} alt="BetterPush" style={logoImg} />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>You updated the password for your BetterPush account on {updatedDate}. If this was you, then no further action is required.</Text>
            <Text style={paragraph}>
              However if you did NOT perform this password change, please{" "}
              <Link href="https://www.betterpush.io" style={link}>
                reset your account password
              </Link>{" "}
              immediately.
            </Text>
            <Text style={paragraph}>Remember to use a password that is both strong and unique to your BetterPush account.</Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              BetterPush Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Column align="right" style={{ width: "50%", paddingRight: "8px" }}>
              <Img src={`${baseUrl}/static/betterpush-icon-twitter.png`} alt="Twitter" />
            </Column>
            <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
              <Img src={`${baseUrl}/static/betterpush-icon-facebook.png`} alt="Facebook" />
            </Column>
          </Row>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2025 BetterPush, All Rights Reserved <br />
              Nigeria
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default SuccessfulPasswordResetEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  padding: 30,
};

const logoImg = {
  margin: "0 auto",
};

const sectionsBorders = {
  width: "100%",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(0,0,0)",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};
