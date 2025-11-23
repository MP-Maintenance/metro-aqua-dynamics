import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface QuoteNotificationProps {
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    category: string;
  }>;
}

export const QuoteNotificationEmail = ({
  customerName,
  customerEmail,
  items,
}: QuoteNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Quote Request from {customerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png"
            alt="Metro Pools"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>New Quote Request</Heading>
        
        <Text style={text}>
          A new quote request has been submitted and requires your attention.
        </Text>

        <Section style={infoSection}>
          <Heading style={h2}>Customer Information</Heading>
          <Text style={infoText}>
            <strong>Name:</strong> {customerName}
          </Text>
          <Text style={infoText}>
            <strong>Email:</strong> {customerEmail}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Heading style={h2}>Requested Items</Heading>
          {items.map((item, index) => (
            <div key={index} style={itemCard}>
              <Text style={itemName}>{item.name}</Text>
              <Text style={itemDetails}>
                Quantity: {item.quantity} | Category: {item.category}
              </Text>
            </div>
          ))}
        </Section>

        <Hr style={hr} />

        <Section style={ctaSection}>
          <Text style={text}>
            Please log in to the admin dashboard to review and respond to this quote request.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © 2025 Metro Pools W.L.L. | Swimming Pool Specialists in Qatar
          </Text>
          <Text style={footerText}>
            <Link href="https://metro-pools.com" style={footerLink}>
              www.metro-pools.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default QuoteNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#051B2C',
};

const logo = {
  margin: '0 auto',
  maxWidth: '200px',
};

const h1 = {
  color: '#0D2D44',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 20px 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#0D2D44',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const text = {
  color: '#587C88',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 20px 20px',
  textAlign: 'center' as const,
};

const infoSection = {
  margin: '32px 20px',
};

const infoText = {
  color: '#587C88',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const itemCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #e2e8f0',
};

const itemName = {
  color: '#0D2D44',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const itemDetails = {
  color: '#587C88',
  fontSize: '14px',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 20px',
};

const ctaSection = {
  margin: '32px 20px',
};

const footer = {
  margin: '48px 20px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '4px 0',
};

const footerLink = {
  color: '#00A99D',
  textDecoration: 'none',
};
