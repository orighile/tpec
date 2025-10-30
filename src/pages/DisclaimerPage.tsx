import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Shield, Scale } from "lucide-react";

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important legal information and disclaimers for TPEC Events services
            </p>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg mx-auto">
              
              {/* General Disclaimer */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                    General Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The information contained on this website and any related communications is provided on an "as is" basis. 
                    To the fullest extent permitted by law, TPEC Events excludes all representations, warranties, undertakings, 
                    and guarantees relating to the content and use of this website.
                  </p>
                  <p>
                    TPEC Events makes no representations or warranties about the accuracy, completeness, or suitability for any purpose 
                    of the information and related graphics published on this website. All such information is provided without warranty 
                    of any kind and is subject to change without notice.
                  </p>
                </CardContent>
              </Card>

              {/* Service Limitations */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-6 w-6 text-blue-500 mr-2" />
                    Service Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Planning Services</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>TPEC Events acts as a facilitator and consultant for event planning services</li>
                    <li>We do not guarantee specific outcomes or results for any event</li>
                    <li>Event success depends on various factors including weather, vendor performance, and guest participation</li>
                    <li>Changes in government regulations, venue policies, or force majeure events may affect service delivery</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Vendor Marketplace</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>TPEC Events provides a platform for vendor listings but does not directly employ or control these vendors</li>
                    <li>We do not guarantee the quality, reliability, or performance of third-party vendors</li>
                    <li>All vendor agreements are between the client and the vendor directly</li>
                    <li>TPEC Events is not liable for vendor disputes, cancellations, or service failures</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Financial Disclaimers */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-6 w-6 text-green-500 mr-2" />
                    Financial Disclaimers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Budget Calculations</h3>
                  <p>
                    Budget estimates and calculations provided through our tools are for informational purposes only. 
                    Actual costs may vary significantly based on market conditions, vendor pricing, location, 
                    and specific requirements. We recommend obtaining formal quotes from vendors for accurate pricing.
                  </p>

                  <h3 className="text-lg font-semibold">Payment Processing</h3>
                  <p>
                    TPEC Events uses third-party payment processors. We are not responsible for payment processing errors, 
                    delays, or failures. All payment disputes should be directed to the respective payment processor or vendor.
                  </p>

                  <h3 className="text-lg font-semibold">Refund Policies</h3>
                  <p>
                    Refund policies vary by service and vendor. Clients are responsible for understanding and agreeing to 
                    individual vendor refund policies before making payments. TPEC Events consultation fees are generally 
                    non-refundable once services have been rendered.
                  </p>
                </CardContent>
              </Card>

              {/* Technical Disclaimers */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 text-purple-500 mr-2" />
                    Technical Disclaimers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Website Availability</h3>
                  <p>
                    While we strive to ensure our website is available 24/7, we cannot guarantee uninterrupted access. 
                    The website may be temporarily unavailable due to maintenance, updates, or technical issues.
                  </p>

                  <h3 className="text-lg font-semibold">Data Security</h3>
                  <p>
                    We implement reasonable security measures to protect user data, but cannot guarantee absolute security. 
                    Users share personal information at their own risk and should review our Privacy Policy for detailed information.
                  </p>

                  <h3 className="text-lg font-semibel">Third-Party Links</h3>
                  <p>
                    Our website may contain links to third-party websites. We are not responsible for the content, 
                    privacy practices, or reliability of external websites.
                  </p>
                </CardContent>
              </Card>

              {/* Liability Limitations */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                    Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    To the maximum extent permitted by applicable law, TPEC Events shall not be liable for any direct, 
                    indirect, incidental, consequential, or punitive damages arising from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use or inability to use our services or website</li>
                    <li>Event cancellations, postponements, or modifications due to circumstances beyond our control</li>
                    <li>Vendor performance or non-performance</li>
                    <li>Loss of data, profits, or business opportunities</li>
                    <li>Force majeure events including but not limited to natural disasters, government actions, or pandemics</li>
                  </ul>
                  
                  <p className="font-semibold">
                    In no event shall TPEC Events' total liability exceed the amount paid by the client for the specific service in question.
                  </p>
                </CardContent>
              </Card>

              {/* Jurisdiction */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Governing Law and Jurisdiction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This disclaimer and all services provided by TPEC Events are governed by the laws of the Federal Republic of Nigeria. 
                    Any disputes arising from our services shall be subject to the jurisdiction of Nigerian courts, 
                    specifically courts in Lagos State where our business is registered.
                  </p>
                  
                  <p>
                    For clients located outside Nigeria, local laws may also apply, and clients are advised to seek 
                    local legal counsel regarding their rights and obligations.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Questions About This Disclaimer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    If you have any questions about this disclaimer or need clarification on any points, 
                    please contact us:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>TPEC Events</strong></p>
                    <p>Email: info@tpecevents.com</p>
                    <p>Phone: +234 9053065636</p>
                    <p>Location: Ibeju-Lekki, Lagos, Nigeria</p>
                  </div>
                </CardContent>
              </Card>

              {/* Last Updated */}
              <div className="text-center text-gray-500 text-sm">
                <p>This disclaimer was last updated on {new Date().toLocaleDateString()}.</p>
                <p>TPEC Events reserves the right to update this disclaimer at any time without prior notice.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DisclaimerPage;