import React from "react";

const TermsOfServicePage = () => {
  return (
    <main className="flex-1 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to TPEC. These Terms of Service ("Terms") govern your use of our website and services. 
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part 
              of the terms, then you may not access our services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            <p className="mb-4 text-muted-foreground">
              Our services are intended for users who are at least 18 years of age. By using our services, you represent 
              and warrant that you are at least 18 years old and that your use of the services does not violate any 
              applicable laws or regulations.
            </p>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password and for restricting 
              access to your computer. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The service and its original content, features, and functionality are and will remain the exclusive property 
              of TPEC and its licensors. The service is protected by copyright, trademark, and other laws of both 
              Nigeria and foreign countries. Our trademarks and trade dress may not be used in connection with any product 
              or service without the prior written consent of TPEC.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
            <p className="text-muted-foreground">
              Our services may allow you to post, link, store, share and otherwise make available certain information, text, 
              graphics, videos, or other material. You are responsible for the content that you post to the service, including 
              its legality, reliability, and appropriateness.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall TPEC, nor its directors, employees, partners, agents, suppliers, or affiliates, be 
              liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or 
              inability to access or use the service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its 
              conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered 
              a waiver of those rights.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
              a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:info@tpecevents.com" className="text-primary">info@tpecevents.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;
