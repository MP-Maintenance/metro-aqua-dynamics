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

interface PreConsultationNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceRequired: string;
  facilityType?: string;
  dimensions?: {
    length?: number;
    width?: number;
    depth?: number;
  };
}

export const PreConsultationNotificationEmail = ({
  customerName,
  customerEmail,
  customerPhone,
  serviceRequired,
  facilityType,
  dimensions,
}: PreConsultationNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Pre-Consultation Request from {customerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://ieuzdcrjvvimtmknycmh.supabase.co/storage/v1/object/public/pre-consultation-files/metro-pools-logo.png"
            alt="Metro Pools"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>New Pre-Consultation Request</Heading>
        
        <Text style={text}>
          A new pre-consultation has been submitted and requires your attention.
        </Text>

        <Section style={infoSection}>
          <Heading style={h2}>Customer Information</Heading>
          <Text style={infoText}>
            <strong>Name:</strong> {customerName}
          </Text>
          <Text style={infoText}>
            <strong>Email:</strong> {customerEmail}
          </Text>
          <Text style={infoText}>
            <strong>Phone:</strong> {customerPhone}
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Heading style={h2}>Project Details</Heading>
          <Text style={infoText}>
            <strong>Service Required:</strong> {serviceRequired}
          </Text>
          {facilityType && (
            <Text style={infoText}>
              <strong>Facility Type:</strong> {facilityType}
            </Text>
          )}
          {dimensions && (
            <div style={dimensionsBox}>
              <Text style={dimensionsTitle}>Dimensions</Text>
              <Text style={dimensionsText}>
                {dimensions.length ? `${dimensions.length}m` : 'N/A'} × {dimensions.width ? `${dimensions.width}m` : 'N/A'} × {dimensions.depth ? `${dimensions.depth}m` : 'N/A'}
              </Text>
            </div>
          )}
        </Section>

        <Hr style={hr} />

        <Section style={ctaSection}>
          <Text style={text}>
            Please log in to the admin dashboard to review the full details and respond to this pre-consultation request.
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

export default PreConsultationNotificationEmail;

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

const dimensionsBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #e2e8f0',
  marginTop: '12px',
};

const dimensionsTitle = {
  color: '#0D2D44',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const dimensionsText = {
  color: '#587C88',
  fontSize: '15px',
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
