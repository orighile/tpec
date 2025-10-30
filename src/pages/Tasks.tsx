
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskManagement from "@/components/TaskManagement";

const Tasks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <TaskManagement />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tasks;
