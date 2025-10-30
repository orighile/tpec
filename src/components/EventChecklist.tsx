
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Circle, Plus, Trash, Calendar, Clock, ArrowsDownUp } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

// Task type definition
type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate: Date | null;
  priority: "low" | "medium" | "high";
};

// Default task categories
const taskCategories = [
  "Pre-Event",
  "Venue",
  "Vendors",
  "Guests",
  "Day-of",
  "Post-Event"
];

// Sample tasks
const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Book venue",
    category: "Venue",
    completed: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "high",
  },
  {
    id: "2",
    title: "Send invitations",
    category: "Guests",
    completed: false,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: "medium",
  },
  {
    id: "3",
    title: "Confirm catering menu",
    category: "Vendors",
    completed: true,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    priority: "medium",
  },
];

const EventChecklist = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTask, setNewTask] = useState<{
    title: string;
    category: string;
    dueDate: Date | null;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    category: "",
    dueDate: null,
    priority: "medium",
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.category) {
      toast({
        title: "Missing information",
        description: "Please provide a task title and category.",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      category: newTask.category,
      completed: false,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      category: "",
      dueDate: null,
      priority: "medium",
    });

    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your checklist.`,
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Remove task
  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task removed",
      description: "The task has been removed from your checklist.",
    });
  };

  // Clear completed tasks
  const clearCompletedTasks = () => {
    if (tasks.some(task => task.completed)) {
      if (confirm("Are you sure you want to clear all completed tasks?")) {
        setTasks(tasks.filter(task => !task.completed));
        toast({
          title: "Tasks cleared",
          description: "All completed tasks have been removed.",
        });
      }
    } else {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to clear.",
      });
    }
  };

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    if (activeTab === "pending") {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeTab === "completed") {
      filtered = filtered.filter(task => task.completed);
    } else if (activeTab !== "all") {
      filtered = filtered.filter(task => task.category === activeTab);
    }
    
    // Sort tasks based on sortBy
    if (sortBy === "dueDate") {
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
    } else if (sortBy === "priority") {
      const priorityOrder: Record<string, number> = {
        high: 0,
        medium: 1,
        low: 2,
      };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  };

  const priorityColors: Record<string, string> = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new task form */}
        <div className="space-y-4">
          <h3 className="font-medium">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Task description"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-1 md:col-span-2"
            />
            
            <Select
              value={newTask.category}
              onValueChange={(value) => setNewTask({ ...newTask, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? (
                      format(newTask.dueDate, "PPP")
                    ) : (
                      <span>Due date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newTask.dueDate || undefined}
                    onSelect={(date) => setNewTask({ ...newTask, dueDate: date || null })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <Select
              value={newTask.priority}
              onValueChange={(value: "low" | "medium" | "high") => 
                setNewTask({ ...newTask, priority: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleAddTask} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Task list */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="priority">
                    <div className="flex items-center">
                      <ArrowsDownUp className="mr-2 h-4 w-4" />
                      <span>Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="alphabetical">
                    <div className="flex items-center">
                      <span>Alphabetical</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCompletedTasks}
              >
                Clear Completed
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {getFilteredTasks().length > 0 ? (
              getFilteredTasks().map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    task.completed ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="text-primary focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline">{task.category}</Badge>
                        <span className={priorityColors[task.priority]}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(task.dueDate, "PP")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                {activeTab === "completed"
                  ? "No completed tasks yet."
                  : activeTab === "pending"
                  ? "No pending tasks. Nice work!"
                  : "No tasks found. Add some tasks to get started."}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventChecklist;
