import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, pixelBasedPreset, Row, Section, Tailwind, Text } from "@react-email/components";
import type * as React from "react";

interface Steps {
  id: number;
  Description: React.ReactNode;
}
interface Links {
  title: string;
  href: string;
}

export interface WelcomeEmailProps {
  username?: string;
}

const steps: Steps[] = [
  {
    id: 1,
    Description: (
      <li className="mb-20" key={1}>
        <strong>Deploy your first project.</strong> <Link>Connect to Git, choose a template</Link>, or manually deploy a project you've been working on locally.
      </li>
    ),
  },
  {
    id: 2,
    Description: (
      <li className="mb-20" key={2}>
        <strong>Check your deploy logs.</strong> Find out what's included in your build and watch for errors or failed deploys. <Link>Learn how to read your deploy logs</Link>.
      </li>
    ),
  },
  {
    id: 3,
    Description: (
      <li className="mb-20" key={3}>
        <strong>Choose an integration.</strong> Connect and configure the right tools for your project with 3+ integrations to choose from. <Link>Explore the Integrations Hub</Link>.
      </li>
    ),
  },
  {
    id: 4,
    Description: (
      <li className="mb-20" key={4}>
        <strong>Set up a custom domain.</strong> You can register a new domain and buy it through BetterPush or assign a domain you already own to your site. <Link>Add a custom domain</Link>.
      </li>
    ),
  },
];

const links: Links[] = [
  { title: "Read the docs", href: "https://www.betterpush.io/docs" },
  { title: "Contact us", href: "https://www.betterpush.io/contact" },
];

const baseUrl = process.env.BASE_URL;

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>BetterPush Welcome</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Img src={`${baseUrl}/static/BetterPush-logo.png`} width="184" height="75" alt="BetterPush" className="mx-auto my-20" />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">Welcome to BetterPush</Heading>

            <Section>
              <Row>
                <Text className="text-base">Congratulations {username}! </Text>
                <Text className="text-base">You're among millions of developers around the world who use BetterPush to deploy apps.</Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button className="rounded-lg bg-brand px-[18px] py-3 text-white" href="https://betterpush.io/login">
                Go to your dashboard
              </Button>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link.title}>
                    <Link className="font-bold text-black underline" href={link.href}>
                      {link.title}
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="px-20 text-right">
                  <Link href="/unsubscribe">Unsubscribe</Link>
                </Column>
              </Row>
            </Section>
            <Text className="mb-45 text-center text-gray-400">BetterPush, Nigeria</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
