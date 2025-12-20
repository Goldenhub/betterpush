import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from "@react-email/components";

export interface VerifyEmailProps {
  username?: string;
  verificationToken?: string;
}

const baseUrl = process.env.BASE_URL;

const VerifyEmail = ({ username, verificationToken }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>BetterPush Verify your email address</Preview>
        <Container style={container}>
          <Img src={`${baseUrl}/betterpush-logo.png`} width="40" height="33" alt="BetterPush" />
          <Section>
            <Text style={text}>Hi {username},</Text>
            <Text style={text}>You created an account on BetterPush</Text>
            <Text style={text}>Kindly click the button below to verify your email address. The verification link expires in 30mins</Text>
            <Button style={button} href={`${baseUrl}/verify-email?username=${username}&token=${verificationToken}`}>
              Verify Email
            </Button>
            <Text style={text}>If you didn't request this, just ignore and delete this message.</Text>
            <Text style={text}>To keep your account secure, please don't forward this email to anyone.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily: "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
