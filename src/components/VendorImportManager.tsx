import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Upload, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { uploadVendorCSVToStorage } from '@/utils/uploadVendorCSV';

interface ImportStats {
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

const VendorImportManager = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [isSettingUpCron, setIsSettingUpCron] = useState(false);
  const [cronSetup, setCronSetup] = useState(false);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);
  const { toast } = useToast();

  // Upload CSV to storage on component mount
  useEffect(() => {
    const uploadCSV = async () => {
      setIsUploadingCSV(true);
      const result = await uploadVendorCSVToStorage();
      setIsUploadingCSV(false);
      
      if (!result.success) {
        console.error('Failed to upload CSV:', result.error);
      }
    };
    
    uploadCSV();
  }, []);

  const handleManualImport = async () => {
    setIsImporting(true);
    setImportStats(null);
    
    try {
      // Fetch CSV content from public folder
      const csvResponse = await fetch('/data/vendors_from_excel.csv');
      if (!csvResponse.ok) {
        throw new Error('Failed to load CSV file');
      }
      const csvContent = await csvResponse.text();
      
      const { data, error } = await supabase.functions.invoke('import-vendors-csv', {
        body: { csvContent }
      });

      if (error) throw error;

      if (data.success) {
        setImportStats(data.stats);
        toast({
          title: "Import Successful",
          description: `Processed ${data.stats.processed} vendors: ${data.stats.inserted} inserted, ${data.stats.updated} updated`,
        });
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import vendors",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSetupCron = async () => {
    setIsSettingUpCron(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('setup-vendor-cron');

      if (error) throw error;

      if (data.success) {
        setCronSetup(true);
        toast({
          title: "Automatic Import Scheduled",
          description: "Vendors will be imported every Monday at 2:00 AM",
        });
      } else {
        throw new Error(data.error || 'Cron setup failed');
      }
    } catch (error) {
      console.error('Cron setup failed:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup automatic import",
        variant: "destructive",
      });
    } finally {
      setIsSettingUpCron(false);
    }
  };

  const getProgressValue = () => {
    if (!importStats) return 0;
    const total = importStats.inserted + importStats.updated + importStats.skipped;
    return total > 0 ? ((importStats.inserted + importStats.updated) / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Vendor CSV Import Management
          </CardTitle>
          <CardDescription>
            Import and sync vendor data from the CSV file. Set up automatic weekly imports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleManualImport} 
              disabled={isImporting || isUploadingCSV}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Import Now
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSetupCron} 
              disabled={isSettingUpCron || cronSetup}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isSettingUpCron ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Setting up...
                </>
              ) : cronSetup ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Cron Active
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  Setup Auto Import
                </>
              )}
            </Button>
          </div>

          {cronSetup && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Automatic import scheduled: Every Monday at 2:00 AM
              </span>
            </div>
          )}

          {importStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{importStats.processed}</div>
                  <div className="text-sm text-blue-700">Processed</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importStats.inserted}</div>
                  <div className="text-sm text-green-700">Inserted</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{importStats.updated}</div>
                  <div className="text-sm text-yellow-700">Updated</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importStats.skipped}</div>
                  <div className="text-sm text-red-700">Skipped</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Import Progress</span>
                  <span>{Math.round(getProgressValue())}%</span>
                </div>
                <Progress value={getProgressValue()} className="w-full" />
              </div>

              {importStats.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Import Errors ({importStats.errors.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importStats.errors.slice(0, 10).map((error, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {error}
                      </Badge>
                    ))}
                    {importStats.errors.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{importStats.errors.length - 10} more errors...
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorImportManager;