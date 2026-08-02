export default function PrivacyPage() {
  return (
    <main className="wrap" style={{ maxWidth: "800px" }}>
      <h1>Privacy Policy</h1>
      <p className="subhead">Last updated: August 2026</p>
      
      <div className="panel" style={{ marginTop: "40px", lineHeight: "1.6" }}>
        <h3>1. Information We Collect</h3>
        <p>When you use Broadcast to publish videos to social media platforms (such as YouTube, Twitter, Meta, etc.), we request access to your social media accounts via OAuth. We temporarily store your access tokens and basic profile information (like channel name) solely for the purpose of publishing content on your behalf.</p>
        
        <h3>2. How We Use Your Data</h3>
        <p>The access tokens are securely stored in our database and are used strictly to upload videos and images you provide to your connected social channels. We do not sell your data, use it for advertising, or share it with any third parties.</p>

        <h3>3. YouTube API Services</h3>
        <p>By connecting your YouTube account, you agree to be bound by the YouTube Terms of Service (https://www.youtube.com/t/terms) and Google Privacy Policy (https://policies.google.com/privacy). We use the YouTube API to fetch your channel name and upload your videos.</p>

        <h3>4. Revoking Access</h3>
        <p>You can revoke our application's access to your accounts at any time through the respective platform's security settings (e.g., Google Account Permissions page).</p>
      </div>
    </main>
  );
}
