import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, CheckCircle, AlertCircle, Upload, FileText, 
  Camera, MapPin, Phone, Mail, Globe, Star, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'insurance' | 'portfolio' | 'references';
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

interface VendorVerificationProps {
  vendorId: string;
  currentStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  onStatusChange?: (status: string) => void;
}

const VendorVerification: React.FC<VendorVerificationProps> = ({
  vendorId,
  currentStatus,
  onStatusChange
}) => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    registrationNumber: '',
    businessType: '',
    yearEstablished: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: '1',
      type: 'business_license',
      name: 'Business Registration Certificate',
      status: 'approved',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'tax_certificate',
      name: 'Tax Identification Number',
      status: 'pending',
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [portfolio, setPortfolio] = useState({
    description: '',
    specialties: [],
    experience: '',
    achievements: ''
  });

  const { toast } = useToast();

  const verificationSteps = [
    { number: 1, title: 'Business Information', description: 'Basic business details' },
    { number: 2, title: 'Documents', description: 'Upload required documents' },
    { number: 3, title: 'Portfolio', description: 'Showcase your work' },
    { number: 4, title: 'Review', description: 'Submit for verification' }
  ];

  const requiredDocuments = [
    {
      type: 'business_license',
      name: 'Business Registration Certificate',
      description: 'Official business registration from CAC',
      required: true
    },
    {
      type: 'tax_certificate',
      name: 'Tax Identification Number',
      description: 'Valid TIN certificate',
      required: true
    },
    {
      type: 'insurance',
      name: 'Professional Insurance',
      description: 'Professional liability insurance (recommended)',
      required: false
    },
    {
      type: 'portfolio',
      name: 'Work Portfolio',
      description: 'Sample work and client testimonials',
      required: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateProgress = () => {
    const totalSteps = verificationSteps.length;
    const completedSteps = verificationStep - 1;
    return (completedSteps / totalSteps) * 100;
  };

  const handleDocumentUpload = (docType: string) => {
    // Simulate file upload
    const newDoc: VerificationDocument = {
      id: Date.now().toString(),
      type: docType as any,
      name: `${docType.replace('_', ' ').toUpperCase()}.pdf`,
      status: 'pending',
      uploadedAt: new Date()
    };

    setDocuments(prev => [...prev, newDoc]);
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded for review",
    });
  };

  const handleSubmitVerification = () => {
    onStatusChange?.('pending');
    toast({
      title: "Verification Submitted",
      description: "Your application has been submitted for review. You'll hear from us within 24-48 hours.",
    });
  };

  const nextStep = () => {
    if (verificationStep < verificationSteps.length) {
      setVerificationStep(verificationStep + 1);
    }
  };

  const prevStep = () => {
    if (verificationStep > 1) {
      setVerificationStep(verificationStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Vendor Verification
              </CardTitle>
              <CardDescription>Get verified to build trust with clients</CardDescription>
            </div>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Verification Progress</span>
              <span>{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            
            <div className="flex justify-between items-center">
              {verificationSteps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${verificationStep >= step.number 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step.number}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className="text-sm font-medium">{step.title}</div>
                  </div>
                  {step.number < verificationSteps.length && (
                    <div className={`
                      w-16 h-0.5 mx-4
                      ${verificationStep > step.number ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{verificationSteps[verificationStep - 1].title}</CardTitle>
          <CardDescription>{verificationSteps[verificationStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Business Information */}
          {verificationStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name *</Label>
                  <Input
                    placeholder="Your business name"
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number *</Label>
                  <Input
                    placeholder="CAC Registration Number"
                    value={businessInfo.registrationNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, registrationNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type *</Label>
                  <Select value={businessInfo.businessType} onValueChange={(value) => setBusinessInfo({...businessInfo, businessType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="limited_liability">Limited Liability Company</SelectItem>
                      <SelectItem value="incorporated_trustees">Incorporated Trustees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year Established *</Label>
                  <Input
                    type="number"
                    placeholder="2020"
                    value={businessInfo.yearEstablished}
                    onChange={(e) => setBusinessInfo({...businessInfo, yearEstablished: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Business Address *</Label>
                <Textarea
                  placeholder="Complete business address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="+234 800 000 0000"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="business@example.com"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website (Optional)</Label>
                  <Input
                    placeholder="https://example.com"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {verificationStep === 2 && (
            <div className="space-y-6">
              {requiredDocuments.map((doc) => {
                const uploaded = documents.find(d => d.type === doc.type);
                return (
                  <Card key={doc.type}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            {doc.required && <Badge variant="destructive">Required</Badge>}
                            {uploaded && getStatusIcon(uploaded.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          {uploaded && (
                            <div className="mt-2 text-sm">
                              <p>Uploaded: {uploaded.uploadedAt.toLocaleDateString()}</p>
                              {uploaded.reviewedAt && (
                                <p>Reviewed: {uploaded.reviewedAt.toLocaleDateString()}</p>
                              )}
                              {uploaded.notes && (
                                <p className="text-red-600">Note: {uploaded.notes}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {uploaded ? (
                            <Badge className={getStatusColor(uploaded.status)}>
                              {uploaded.status}
                            </Badge>
                          ) : (
                            <Button onClick={() => handleDocumentUpload(doc.type)}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Step 3: Portfolio */}
          {verificationStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Description *</Label>
                <Textarea
                  placeholder="Describe your business, services, and what makes you unique..."
                  value={portfolio.description}
                  onChange={(e) => setPortfolio({...portfolio, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Years of Experience *</Label>
                <Input
                  placeholder="5 years"
                  value={portfolio.experience}
                  onChange={(e) => setPortfolio({...portfolio, experience: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Key Achievements</Label>
                <Textarea
                  placeholder="Awards, certifications, notable projects..."
                  value={portfolio.achievements}
                  onChange={(e) => setPortfolio({...portfolio, achievements: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload Portfolio Images</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Your Work</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload high-quality images of your previous work
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {verificationStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {businessInfo.businessName}</div>
                    <div><strong>Registration:</strong> {businessInfo.registrationNumber}</div>
                    <div><strong>Type:</strong> {businessInfo.businessType}</div>
                    <div><strong>Established:</strong> {businessInfo.yearEstablished}</div>
                    <div><strong>Address:</strong> {businessInfo.address}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documents Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <span className="text-sm">{doc.name}</span>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✅ Our team will review your application within 24-48 hours</p>
                  <p>✅ You'll receive an email notification about the status</p>
                  <p>✅ Once verified, you'll get a verified badge on your profile</p>
                  <p>✅ Verified vendors get priority placement in search results</p>
                </CardContent>
              </Card>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Verification Checklist</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>✅ Business information completed</div>
                  <div>✅ Required documents uploaded</div>
                  <div>✅ Portfolio information provided</div>
                  <div>✅ Ready for submission</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={verificationStep === 1}>
          Previous
        </Button>
        <div className="flex gap-2">
          {verificationStep < verificationSteps.length ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmitVerification} className="bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Submit for Verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorVerification;
