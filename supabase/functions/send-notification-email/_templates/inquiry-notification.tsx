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

interface InquiryNotificationProps {
  inquiryType: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export const InquiryNotificationEmail = ({
  inquiryType,
  fullName,
  email,
  phone,
  serviceType,
  message,
}: InquiryNotificationProps) => (
  <Html>
    <Head />
    <Preview>New {inquiryType} from {fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png"
            alt="Metro Pools"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>New {inquiryType}</Heading>
        
        <Text style={text}>
          A new inquiry has been submitted and requires your attention.
        </Text>

        <Section style={infoSection}>
          <Heading style={h2}>Customer Information</Heading>
          <Text style={infoText}>
            <strong>Name:</strong> {fullName}
          </Text>
          <Text style={infoText}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={infoText}>
            <strong>Phone:</strong> {phone}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Heading style={h2}>Inquiry Details</Heading>
          <Text style={infoText}>
            <strong>Type:</strong> {inquiryType}
          </Text>
          <Text style={infoText}>
            <strong>Service:</strong> {serviceType}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Heading style={h2}>Message</Heading>
          <div style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </div>
        </Section>

        <Hr style={hr} />

        <Section style={ctaSection}>
          <Text style={text}>
            Please log in to the admin dashboard to review and respond to this inquiry.
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

export default InquiryNotificationEmail;

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

const messageBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #e2e8f0',
  marginTop: '12px',
};

const messageText = {
  color: '#0D2D44',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
