import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, Upload, FileText, Database, Calendar, Users,
  Shield, Settings, Clock, CheckCircle, AlertCircle,
  Archive, Trash2, RefreshCw, Eye, FileJson, Plus,
  FileSpreadsheet, File, Cloud, HardDrive, Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'selective';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  dataTypes: string[];
  size: string;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: 'json' | 'csv' | 'excel' | 'pdf';
  dataTypes: string[];
  customFields?: string[];
  enabled: boolean;
}

const BackupExportFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backup');
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([
    {
      id: '1',
      name: 'Daily Full Backup',
      type: 'full',
      status: 'completed',
      progress: 100,
      dataTypes: ['events', 'vendors', 'bookings', 'payments'],
      size: '45.2 MB',
      createdAt: new Date('2024-08-25T02:00:00'),
      completedAt: new Date('2024-08-25T02:15:00'),
      downloadUrl: '/api/downloads/backup-daily-20240825.zip'
    },
    {
      id: '2',
      name: 'Events Export',
      type: 'selective',
      status: 'running',
      progress: 65,
      dataTypes: ['events'],
      size: '12.8 MB',
      createdAt: new Date('2024-08-25T10:30:00')
    }
  ]);

  const [exportTemplates, setExportTemplates] = useState<ExportTemplate[]>([
    {
      id: '1',
      name: 'Event Report',
      description: 'Complete event data with analytics',
      format: 'excel',
      dataTypes: ['events', 'guests', 'analytics'],
      enabled: true
    },
    {
      id: '2',
      name: 'Vendor Directory',
      description: 'Vendor contact and service information',
      format: 'csv',
      dataTypes: ['vendors', 'services', 'reviews'],
      enabled: true
    },
    {
      id: '3',
      name: 'Financial Report',
      description: 'Payment and revenue data',
      format: 'pdf',
      dataTypes: ['payments', 'invoices', 'analytics'],
      enabled: true
    }
  ]);

  const [newBackup, setNewBackup] = useState({
    name: '',
    type: 'full' as const,
    dataTypes: [] as string[],
    schedule: 'manual' as const
  });

  const [restoreSettings, setRestoreSettings] = useState({
    backupFile: null as File | null,
    restoreType: 'full',
    dataTypes: [] as string[],
    overwriteExisting: false
  });

  const { toast } = useToast();

  const dataTypeOptions = [
    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'vendors', label: 'Vendors', icon: <Users className="h-4 w-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <FileText className="h-4 w-4" /> },
    { id: 'payments', label: 'Payments', icon: <Database className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Eye className="h-4 w-4" /> }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/10 text-primary';
      case 'running': return 'bg-accent text-accent-foreground';
      case 'failed': return 'bg-destructive/10 text-destructive';
      case 'scheduled': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json': return <FileJson className="h-4 w-4" />;
      case 'csv': return <FileSpreadsheet className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf': return <File className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreateBackup = () => {
    if (!newBackup.name || newBackup.dataTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide backup name and select data types",
        variant: "destructive"
      });
      return;
    }

    const backup: BackupJob = {
      id: Date.now().toString(),
      name: newBackup.name,
      type: newBackup.type,
      status: 'running',
      progress: 0,
      dataTypes: newBackup.dataTypes,
      size: '0 MB',
      createdAt: new Date()
    };

    setBackupJobs([backup, ...backupJobs]);
    setNewBackup({ name: '', type: 'full', dataTypes: [], schedule: 'manual' });

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupJobs(jobs => jobs.map(job => {
        if (job.id === backup.id && job.status === 'running') {
          const newProgress = Math.min(job.progress + Math.random() * 20, 100);
          return {
            ...job,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running',
            completedAt: newProgress >= 100 ? new Date() : undefined,
            size: `${(newProgress / 100 * 25).toFixed(1)} MB`,
            downloadUrl: newProgress >= 100 ? `/api/downloads/${backup.id}.zip` : undefined
          };
        }
        return job;
      }));
    }, 1000);

    setTimeout(() => clearInterval(interval), 10000);

    toast({
      title: "Backup Started",
      description: "Your backup job has been queued and will start shortly",
    });
  };

  const handleDownloadBackup = (backup: BackupJob) => {
    if (!backup.downloadUrl) return;

    // Simulate download
    const link = document.createElement('a');
    link.href = backup.downloadUrl;
    link.download = `${backup.name.replace(/\s+/g, '-').toLowerCase()}-${backup.id}.zip`;
    link.click();

    toast({
      title: "Download Started",
      description: "Your backup file download has started",
    });
  };

  const handleExportData = (template: ExportTemplate) => {
    const fileName = `${template.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const extension = template.format === 'excel' ? 'xlsx' : template.format;

    toast({
      title: "Export Started",
      description: `Generating ${template.name} in ${template.format.toUpperCase()} format`,
    });

    // Simulate export process
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `/api/exports/${fileName}.${extension}`;
      link.download = `${fileName}.${extension}`;
      link.click();

      toast({
        title: "Export Complete",
        description: `${template.name} has been exported successfully`,
      });
    }, 2000);
  };

  const handleRestoreData = () => {
    if (!restoreSettings.backupFile) {
      toast({
        title: "No File Selected",
        description: "Please select a backup file to restore",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Restore Started",
      description: "Your data restore process has begun. This may take a few minutes.",
    });

    // Simulate restore process
    setTimeout(() => {
      toast({
        title: "Restore Complete",
        description: "Your data has been restored successfully",
      });
    }, 5000);
  };

  const getTotalBackupSize = () => {
    return backupJobs.reduce((total, job) => {
      const size = parseFloat(job.size);
      return total + (isNaN(size) ? 0 : size);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="h-6 w-6" />
            Backup & Export
          </h1>
          <p className="text-muted-foreground">Backup your data and export reports</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {getTotalBackupSize().toFixed(1)} MB stored
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'backup' ? 'default' : 'outline'}
              onClick={() => setActiveTab('backup')}
            >
              <Database className="h-4 w-4 mr-2" />
              Backup
            </Button>
            <Button
              variant={activeTab === 'export' ? 'default' : 'outline'}
              onClick={() => setActiveTab('export')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant={activeTab === 'restore' ? 'default' : 'outline'}
              onClick={() => setActiveTab('restore')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore
            </Button>
            <Button
              variant={activeTab === 'schedule' ? 'default' : 'outline'}
              onClick={() => setActiveTab('schedule')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Backup</CardTitle>
              <CardDescription>Backup your event data for safekeeping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Backup Name</Label>
                  <Input
                    placeholder="e.g., Weekly Events Backup"
                    value={newBackup.name}
                    onChange={(e) => setNewBackup({...newBackup, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Backup Type</Label>
                  <Select value={newBackup.type} onValueChange={(value) => setNewBackup({...newBackup, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Backup</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                      <SelectItem value="selective">Selective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data Types to Backup</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dataTypeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={newBackup.dataTypes.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const dataTypes = checked
                            ? [...newBackup.dataTypes, option.id]
                            : newBackup.dataTypes.filter(type => type !== option.id);
                          setNewBackup({...newBackup, dataTypes});
                        }}
                      />
                      <Label htmlFor={option.id} className="flex items-center gap-2 text-sm">
                        {option.icon}
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateBackup} className="w-full">
                <Archive className="h-4 w-4 mr-2" />
                Start Backup
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
              <CardDescription>View and manage your backup history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{job.name}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1">{job.status}</span>
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      
                      {job.status === 'running' && (
                        <div className="mb-2">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.progress}% complete
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Size: {job.size}</span>
                        <span>Created: {job.createdAt.toLocaleString()}</span>
                        {job.completedAt && (
                          <span>Completed: {job.completedAt.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex gap-1 mt-2">
                        {job.dataTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(job)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Templates</CardTitle>
              <CardDescription>Pre-configured export formats for different data types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {exportTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              {getFormatIcon(template.format)}
                              {template.format.toUpperCase()}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                          <div className="flex gap-1">
                            {template.dataTypes.map(type => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleExportData(template)}
                            disabled={!template.enabled}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Export</CardTitle>
              <CardDescription>Export specific data on demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Events CSV</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Vendors Excel</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Bookings PDF</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Database className="h-6 w-6" />
                  <span className="text-sm">Full JSON</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Restore Tab */}
      {activeTab === 'restore' && (
        <Card>
          <CardHeader>
            <CardTitle>Restore Data</CardTitle>
            <CardDescription>Restore your data from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Backup File</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".zip,.json,.csv"
                  onChange={(e) => setRestoreSettings({
                    ...restoreSettings,
                    backupFile: e.target.files?.[0] || null
                  })}
                />
                <Button variant="outline">
                  <Cloud className="h-4 w-4 mr-2" />
                  From Cloud
                </Button>
              </div>
            </div>

            {restoreSettings.backupFile && (
              <>
                <div className="space-y-2">
                  <Label>Restore Type</Label>
                  <Select 
                    value={restoreSettings.restoreType} 
                    onValueChange={(value) => setRestoreSettings({...restoreSettings, restoreType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Restore</SelectItem>
                      <SelectItem value="selective">Selective Restore</SelectItem>
                      <SelectItem value="merge">Merge with Existing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite"
                    checked={restoreSettings.overwriteExisting}
                    onCheckedChange={(checked) => setRestoreSettings({
                      ...restoreSettings,
                      overwriteExisting: checked as boolean
                    })}
                  />
                  <Label htmlFor="overwrite" className="text-sm">
                    Overwrite existing data (use with caution)
                  </Label>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Warning</h4>
                      <p className="text-sm text-orange-700">
                        Restoring data will replace your current information. Make sure to backup your current data before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleRestoreData} className="w-full" variant="destructive">
                  <Upload className="h-4 w-4 mr-2" />
                  Start Restore Process
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle>Automated Backup Schedule</CardTitle>
            <CardDescription>Set up automatic backups to run on a schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Daily Full Backup</h3>
                  <p className="text-sm text-muted-foreground">Every day at 2:00 AM</p>
                  <Badge className="mt-1 bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Weekly Export Report</h3>
                  <p className="text-sm text-muted-foreground">Every Sunday at 6:00 PM</p>
                  <Badge className="mt-1 bg-orange-100 text-orange-800">Paused</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BackupExportFeatures;
