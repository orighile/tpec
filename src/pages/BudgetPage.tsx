
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BudgetCalculator from "@/components/BudgetCalculator";
import BudgetShare from "@/components/BudgetShare";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BudgetPage = () => {
  const { toast } = useToast();
  const [budgetId] = useState("demo-budget-123"); // In a real app, this would come from the database

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your budget is being exported as PDF. It will download shortly.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your budget PDF has been downloaded.",
      });
    }, 2000);
  };

  const handleExportExcel = () => {
    toast({
      title: "Exporting Excel",
      description: "Your budget is being exported to Excel. It will download shortly.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your budget Excel file has been downloaded.",
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Budget Management</h1>
            <p className="text-xl text-gray-600">
              Track, plan and manage your event budget with our easy-to-use tools
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <BudgetShare budgetId={budgetId} />
            
            <Button variant="outline" className="flex gap-2 items-center" onClick={handleExportPDF}>
              <Download size={16} />
              Export as PDF
            </Button>
            
            <Button variant="outline" className="flex gap-2 items-center" onClick={handleExportExcel}>
              <FileSpreadsheet size={16} />
              Export to Excel
            </Button>
          </div>
          
          <BudgetCalculator />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Budget Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Planning Wisely</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Prioritize your spending on what matters most to you</li>
                  <li>Keep a contingency fund of about 10-15% of your total budget</li>
                  <li>Get multiple quotes from vendors before making decisions</li>
                  <li>Consider off-peak dates for significant discounts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Common Mistakes to Avoid</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Not accounting for service fees and gratuities</li>
                  <li>Forgetting about smaller expenses that add up</li>
                  <li>Overspending early in the planning process</li>
                  <li>Not reading contracts carefully for hidden fees</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BudgetPage;
