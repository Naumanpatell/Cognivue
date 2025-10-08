import React from 'react';
import '../styles/tncStyle.css';

function TermsAndConditions() {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: October 8, 2025</p>
      </header>

      <main className="terms-content">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Cognivue ("the Service"), you accept and agree to be bound by these 
            Terms and Conditions. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            Cognivue is an AI-powered video analysis platform that provides:
          </p>
          <ul>
            <li>Automatic speech recognition and transcription</li>
            <li>Video content summarization</li>
            <li>Sentiment analysis</li>
            <li>Object and action detection</li>
            <li>Keyword extraction and analytics</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
            without prior notice.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. User Eligibility</h2>
          <p>
            You must be at least 13 years old to use this Service. By using Cognivue, you represent and 
            warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. User Account and Registration</h2>
          <p>
            If account creation is required:
          </p>
          <ul>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. Acceptable Use Policy</h2>
          <h3>You agree NOT to:</h3>
          <ul>
            <li>Upload content that violates any laws or regulations</li>
            <li>Upload content containing malware, viruses, or harmful code</li>
            <li>Upload copyrighted material without authorization</li>
            <li>Upload content that is defamatory, obscene, or harmful</li>
            <li>Upload content containing personal information of others without consent</li>
            <li>Attempt to reverse engineer or exploit the Service</li>
            <li>Use the Service for automated or bulk processing without permission</li>
            <li>Interfere with the proper functioning of the Service</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the Service to harass, abuse, or harm others</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Video Upload Guidelines</h2>
          <p>
            When uploading videos to Cognivue:
          </p>
          <ul>
            <li><strong>File formats:</strong> .mp4, .mov, .avi (as specified)</li>
            <li><strong>File size:</strong> Videos should not exceed 2 minutes in length</li>
            <li><strong>Content restrictions:</strong> Videos must comply with our Acceptable Use Policy</li>
            <li><strong>Rights:</strong> You must own or have permission to upload and process the content</li>
            <li><strong>Processing time:</strong> Processing may take several minutes depending on video length</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>7. Intellectual Property Rights</h2>
          <h3>7.1 Your Content</h3>
          <p>
            You retain all ownership rights to your uploaded videos. By uploading content, you grant 
            Cognivue a limited license to:
          </p>
          <ul>
            <li>Process and analyze your videos using our AI models</li>
            <li>Store processed results (transcripts, summaries, insights)</li>
            <li>Use aggregated, anonymized data to improve our Service</li>
          </ul>
          
          <h3>7.2 Our Content</h3>
          <p>
            The Service, including its design, features, algorithms, and all intellectual property, 
            is owned by Cognivue. You may not copy, modify, distribute, or create derivative works 
            without our written permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. AI-Generated Results</h2>
          <p>
            Cognivue uses artificial intelligence models to process your content. Please note:
          </p>
          <ul>
            <li>AI-generated results may not be 100% accurate</li>
            <li>Transcriptions may contain errors or inaccuracies</li>
            <li>Sentiment analysis is interpretive and may not reflect actual sentiment</li>
            <li>Object detection may miss or misidentify objects</li>
            <li>You should review and verify all AI-generated results before use</li>
            <li>We do not guarantee the accuracy or completeness of any analysis</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>9. Data Usage and Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. By using Cognivue, you 
            consent to our collection and use of data as described in the Privacy Policy.
          </p>
          <p>
            Key points:
          </p>
          <ul>
            <li>We process your videos to generate insights</li>
            <li>Original video files are deleted after processing</li>
            <li>Analysis results are stored temporarily (30 days by default)</li>
            <li>We do not sell or share your content with third parties</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul>
            <li>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
            <li>We do not guarantee uninterrupted, secure, or error-free service</li>
            <li>We are not liable for any loss of data, profits, or damages arising from your use of the Service</li>
            <li>Our total liability shall not exceed the amount you paid for the Service (if applicable)</li>
            <li>We are not responsible for third-party AI model errors or failures</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold Cognivue harmless from any claims, damages, losses, or 
            expenses arising from:
          </p>
          <ul>
            <li>Your violation of these Terms</li>
            <li>Your violation of any laws or third-party rights</li>
            <li>Your uploaded content</li>
            <li>Your use of the Service</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>12. Third-Party Services</h2>
          <p>
            Cognivue uses third-party AI models and services (e.g., Hugging Face models). These services 
            are subject to their own terms and conditions. We are not responsible for the performance or 
            policies of third-party services.
          </p>
        </section>

        <section className="terms-section">
          <h2>13. Termination</h2>
          <p>
            We reserve the right to:
          </p>
          <ul>
            <li>Suspend or terminate your access to the Service at any time</li>
            <li>Remove any content that violates these Terms</li>
            <li>Delete accounts that remain inactive for extended periods</li>
          </ul>
          <p>
            You may stop using the Service at any time. Upon termination, your right to use the Service 
            will immediately cease.
          </p>
        </section>

        <section className="terms-section">
          <h2>14. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions at any time. We will notify users of significant 
            changes by posting the updated Terms on this page and updating the "Last Updated" date. 
            Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>15. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
            without regard to its conflict of law provisions. Any disputes shall be resolved in the courts 
            of [Your Jurisdiction].
          </p>
        </section>

        <section className="terms-section">
          <h2>16. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
            be limited or eliminated to the minimum extent necessary, and the remaining provisions shall 
            remain in full force and effect.
          </p>
        </section>

        <section className="terms-section">
          <h2>17. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> legal@cognivue.com</p> {/* need to make business email */}
            <p><strong>Support:</strong> support@cognivue.com</p>
          </div>
        </section>

        <div className="acknowledgment">
          <p>
            By using Cognivue, you acknowledge that you have read, understood, and agree to be bound by 
            these Terms and Conditions.
          </p>
        </div>
      </main>
    </div>
  );
}

export default TermsAndConditions;