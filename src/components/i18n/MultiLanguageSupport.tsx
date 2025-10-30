import React, { useState, useContext, createContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, Languages, FileText, Save, Plus, Edit, Trash2, 
  Download, Upload, Search, Filter, Check, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
  progress: number;
  totalKeys: number;
  translatedKeys: number;
}

interface Translation {
  key: string;
  category: string;
  en: string;
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  translations: { [key: string]: Translation };
  t: (key: string, params?: { [key: string]: string }) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const defaultLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    enabled: true,
    progress: 100,
    totalKeys: 500,
    translatedKeys: 500
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    enabled: true,
    progress: 85,
    totalKeys: 500,
    translatedKeys: 425
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    enabled: true,
    progress: 90,
    totalKeys: 500,
    translatedKeys: 450
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    flag: '🇳🇬',
    enabled: true,
    progress: 75,
    totalKeys: 500,
    translatedKeys: 375
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    flag: '🇳🇬',
    enabled: true,
    progress: 70,
    totalKeys: 500,
    translatedKeys: 350
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    flag: '🇳🇬',
    enabled: false,
    progress: 45,
    totalKeys: 500,
    translatedKeys: 225
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    enabled: false,
    progress: 30,
    totalKeys: 500,
    translatedKeys: 150
  }
];

const sampleTranslations: Translation[] = [
  {
    key: 'common.welcome',
    category: 'common',
    en: 'Welcome to TPEC Events',
    fr: 'Bienvenue à TPEC Events',
    es: 'Bienvenido a TPEC Events',
    yo: 'Káàbọ̀ sí TPEC Events',
    ig: 'Nnọọ na TPEC Events'
  },
  {
    key: 'common.login',
    category: 'common',
    en: 'Login',
    fr: 'Connexion',
    es: 'Iniciar sesión',
    yo: 'Wọlé',
    ig: 'Banye'
  },
  {
    key: 'events.create',
    category: 'events',
    en: 'Create Event',
    fr: 'Créer un événement',
    es: 'Crear evento',
    yo: 'Ṣẹda Iṣẹlẹ',
    ig: 'Mepụta Mmemme'
  },
  {
    key: 'vendors.search',
    category: 'vendors',
    en: 'Search Vendors',
    fr: 'Rechercher des fournisseurs',
    es: 'Buscar proveedores',
    yo: 'Wa Awọn Olùtàjà',
    ig: 'Chọọ Ndị Na-ere'
  },
  {
    key: 'booking.confirm',
    category: 'booking',
    en: 'Confirm Booking',
    fr: 'Confirmer la réservation',
    es: 'Confirmar reserva',
    yo: 'Jẹ́wọ́ Ìbéèrè',
    ig: 'Kwenye Nkwekọrịta'
  }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [languages] = useState<Language[]>(defaultLanguages);
  const [translations] = useState<{ [key: string]: Translation }>(
    Object.fromEntries(sampleTranslations.map(t => [t.key, t]))
  );

  const t = (key: string, params?: { [key: string]: string }): string => {
    const translation = translations[key];
    if (!translation) return key;

    let text = translation[currentLanguage] || translation.en || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      translations,
      t,
      languages: languages.filter(lang => lang.enabled)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

const MultiLanguageSupport: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>(defaultLanguages);
  const [translations, setTranslations] = useState<Translation[]>(sampleTranslations);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    category: '',
    en: ''
  });
  const [autoTranslate, setAutoTranslate] = useState(false);

  const { toast } = useToast();

  const categories = ['common', 'events', 'vendors', 'booking', 'auth', 'profile', 'settings'];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleToggleLanguage = (langCode: string) => {
    setLanguages(langs => langs.map(lang => 
      lang.code === langCode 
        ? { ...lang, enabled: !lang.enabled }
        : lang
    ));
    
    toast({
      title: "Language Updated",
      description: "Language availability has been updated",
    });
  };

  const handleSaveTranslation = () => {
    if (!editingTranslation) return;

    setTranslations(trans => trans.map(t => 
      t.key === editingTranslation.key ? editingTranslation : t
    ));

    setEditingTranslation(null);
    
    toast({
      title: "Translation Saved",
      description: "Translation has been updated successfully",
    });
  };

  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.en) {
      toast({
        title: "Missing Information",
        description: "Please provide translation key and English text",
        variant: "destructive"
      });
      return;
    }

    const translation: Translation = {
      key: newTranslation.key,
      category: newTranslation.category || 'common',
      en: newTranslation.en
    };

    // Add empty translations for other languages
    languages.forEach(lang => {
      if (lang.code !== 'en') {
        translation[lang.code] = '';
      }
    });

    setTranslations([...translations, translation]);
    setNewTranslation({ key: '', category: '', en: '' });
    
    toast({
      title: "Translation Added",
      description: "New translation key has been added",
    });
  };

  const handleDeleteTranslation = (key: string) => {
    setTranslations(trans => trans.filter(t => t.key !== key));
    
    toast({
      title: "Translation Deleted",
      description: "Translation has been removed",
    });
  };

  const handleExportTranslations = () => {
    const data = JSON.stringify(translations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Translations have been exported to JSON file",
    });
  };

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         translation.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || translation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCompletionStats = () => {
    const enabledLanguages = languages.filter(lang => lang.enabled);
    return enabledLanguages.map(lang => ({
      ...lang,
      completed: translations.filter(t => t[lang.code] && t[lang.code].trim() !== '').length,
      total: translations.length,
      percentage: Math.round((translations.filter(t => t[lang.code] && t[lang.code].trim() !== '').length / translations.length) * 100)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Multi-Language Support
          </h1>
          <p className="text-muted-foreground">Manage translations and language settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTranslations}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'languages' ? 'default' : 'outline'}
              onClick={() => setActiveTab('languages')}
            >
              Languages
            </Button>
            <Button
              variant={activeTab === 'translations' ? 'default' : 'outline'}
              onClick={() => setActiveTab('translations')}
            >
              Translations
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Languages</p>
                    <p className="text-2xl font-bold">{languages.filter(l => l.enabled).length}</p>
                  </div>
                  <Languages className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Translation Keys</p>
                    <p className="text-2xl font-bold">{translations.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                    <p className="text-2xl font-bold">
                      {Math.round(languages.filter(l => l.enabled).reduce((sum, l) => sum + l.progress, 0) / languages.filter(l => l.enabled).length)}%
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Translation Progress</CardTitle>
              <CardDescription>Completion status for each language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCompletionStats().map((lang) => (
                  <div key={lang.code} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">
                          {lang.completed}/{lang.total} keys translated
                        </span>
                        <span className="text-sm font-medium">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(lang.percentage)}`}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Languages Tab */}
      {activeTab === 'languages' && (
        <div className="space-y-4">
          {languages.map((language) => (
            <Card key={language.code}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{language.flag}</span>
                    <div>
                      <h3 className="font-semibold">{language.name}</h3>
                      <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 bg-muted rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getProgressColor(language.progress)}`}
                            style={{ width: `${language.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {language.progress}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={language.enabled ? "default" : "secondary"}>
                      {language.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={language.enabled}
                      onCheckedChange={() => handleToggleLanguage(language.code)}
                      disabled={language.code === 'en'} // Don't allow disabling English
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Translations Tab */}
      {activeTab === 'translations' && (
        <div className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search translations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setActiveTab('add-translation')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Translations List */}
          <div className="space-y-2">
            {filteredTranslations.map((translation) => (
              <Card key={translation.key}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{translation.category}</Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {translation.key}
                        </code>
                      </div>
                      <div className="space-y-2">
                        {languages.filter(lang => lang.enabled).map(lang => (
                          <div key={lang.code} className="flex items-center gap-2">
                            <span className="text-lg w-8">{lang.flag}</span>
                            <span className="w-16 text-sm text-muted-foreground">
                              {lang.code.toUpperCase()}
                            </span>
                            <span className="flex-1 text-sm">
                              {translation[lang.code] || (
                                <span className="text-muted-foreground italic">
                                  Not translated
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTranslation(translation)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTranslation(translation.key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation Settings</CardTitle>
              <CardDescription>Configure translation behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-translate new keys</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically translate new keys using translation service
                  </p>
                </div>
                <Switch
                  checked={autoTranslate}
                  onCheckedChange={setAutoTranslate}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(lang => lang.enabled).map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fallback Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(lang => lang.enabled).map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Translation Tab */}
      {activeTab === 'add-translation' && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Translation</CardTitle>
            <CardDescription>Create a new translation key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Translation Key</Label>
                <Input
                  placeholder="e.g., common.welcome"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation({...newTranslation, key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newTranslation.category} 
                  onValueChange={(value) => setNewTranslation({...newTranslation, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>English Text</Label>
              <Textarea
                placeholder="Enter the English text for this translation"
                value={newTranslation.en}
                onChange={(e) => setNewTranslation({...newTranslation, en: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTranslation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Translation
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('translations')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Translation Modal */}
      {editingTranslation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Translation</CardTitle>
              <CardDescription>Update translations for: {editingTranslation.key}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.filter(lang => lang.enabled).map(lang => (
                <div key={lang.code} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name} ({lang.code.toUpperCase()})
                  </Label>
                  <Textarea
                    value={editingTranslation[lang.code] || ''}
                    onChange={(e) => setEditingTranslation({
                      ...editingTranslation,
                      [lang.code]: e.target.value
                    })}
                    placeholder={`Enter ${lang.name} translation...`}
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveTranslation}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingTranslation(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MultiLanguageSupport;
