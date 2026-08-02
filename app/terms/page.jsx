export default function TermsPage() {
  return (
    <main className="wrap" style={{ maxWidth: "800px" }}>
      <h1>Terms of Service</h1>
      <p className="subhead">Last updated: August 2026</p>
      
      <div className="panel" style={{ marginTop: "40px", lineHeight: "1.6" }}>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using Broadcast, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3>2. User Responsibilities</h3>
        <p>You are solely responsible for the content you upload and publish through this service. You agree not to use the service for any unlawful purposes or to upload content that violates the terms of service of the respective social media platforms (e.g., YouTube, Twitter).</p>

        <h3>3. Service Availability</h3>
        <p>We do not guarantee that the service will be available 100% of the time. The service relies on third-party APIs which may experience downtime or rate limits.</p>

        <h3>4. Limitation of Liability</h3>
        <p>Broadcast shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.</p>
      </div>
    </main>
  );
}
