
export type ExpenseItem = {
  id: string;
  category: string;
  description: string;
  amount: number;
  paid: boolean;
};

export type ExpenseCategory = 
  | "Venue"
  | "Catering"
  | "Decoration"
  | "Entertainment"
  | "Photography"
  | "Transportation"
  | "Attire"
  | "Stationery"
  | "Gifts"
  | "Other";

export type ExpenseFilter = {
  category: string;
  paidStatus: "all" | "paid" | "unpaid";
  search: string;
};

