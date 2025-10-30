import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

const DomainsPage: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { toast } = useToast();
  const exampleCNAME = `cname.vercel-dns.com`;

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.length > 0;
  };

  const handleDomainSubmit = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    if (!validateDomain(domain.trim())) {
      setValidationStatus('invalid');
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain format (e.g., example.com)",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setValidationStatus('valid');
    
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      toast({
        title: "Domain Added",
        description: `${domain} has been configured for DNS setup`,
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Custom Domains</CardTitle>
          <CardDescription>Connect your domain to serve your TPEC site on a custom URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  id="domain" 
                  placeholder="example.com" 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)}
                  className={validationStatus === 'invalid' ? 'border-red-500' : validationStatus === 'valid' ? 'border-green-500' : ''}
                />
                {validationStatus === 'valid' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {validationStatus === 'invalid' && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              <Button type="button" onClick={handleDomainSubmit} disabled={isValidating}>
                {isValidating ? "Validating..." : "Add Domain"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">DNS Setup</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to your domain registrar DNS settings.</li>
              <li>Create a CNAME record for <code>@</code> or <code>www</code> pointing to:</li>
            </ol>
            <div className="mt-2 p-3 rounded border bg-muted/30 font-mono text-sm select-all">{exampleCNAME}</div>
            <p className="text-xs text-muted-foreground">Note: If using apex (root) domain, use ALIAS/ANAME if your DNS supports it; otherwise point www to the CNAME and redirect apex to www.</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Verification</p>
            <p className="text-sm">After adding the record, deploy your site on Vercel and add this domain in the Vercel Project Settings → Domains. Verification may take up to 24 hours depending on DNS propagation.</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Wildcard / Multitenancy</p>
            <p className="text-sm">Planned: support tenant subdomains like org.tpec.app via wildcard CNAME. This UI will later allow mapping organizations to domains.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainsPage;
