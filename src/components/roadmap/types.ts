
export type TaskStatus = "completed" | "in-progress" | "upcoming" | "blocked" | "canceled";

export type TaskItem = {
  name: string;
  status: TaskStatus;
  isCritical?: boolean;
  riskLevel?: "low" | "medium" | "high";
  notes?: string;
};

export type Phase = {
  id: number;
  name: string;
  status: TaskStatus;
  description: string;
  timeframe: string;
  tasks: TaskItem[];
  dependencies?: number[];
};
