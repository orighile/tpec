import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface Guest {
  id: string;
  fullName: string;
  group: string;
  tableId: string | null;
  email?: string;
  phone?: string;
  rsvpStatus?: 'pending' | 'confirmed' | 'declined';
}

export interface TableItem {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  shape: "round" | "rectangle" | "oval" | "square";
  size: number;
  capacity: number;
  guests: string[];
}

export interface FixedElement {
  id: string;
  name: string;
  type: "stage" | "danceFloor" | "bar" | "entrance" | "custom";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// In-memory storage for seating arrangements until table is created
const seatingArrangements: Map<string, { tables: TableItem[]; fixedElements: FixedElement[] }> = new Map();

// Demo data for first-time visitors
const DEMO_TABLES: TableItem[] = [
  {
    id: 'demo-table-1',
    name: 'Head Table',
    x: 100,
    y: 50,
    rotation: 0,
    shape: 'rectangle',
    size: 1.2,
    capacity: 8,
    guests: ['demo-1', 'demo-5'],
  },
  {
    id: 'demo-table-2',
    name: 'Table 2 - Friends',
    x: 100,
    y: 200,
    rotation: 0,
    shape: 'round',
    size: 1,
    capacity: 10,
    guests: ['demo-2'],
  },
  {
    id: 'demo-table-3',
    name: 'Table 3 - Colleagues',
    x: 300,
    y: 200,
    rotation: 0,
    shape: 'round',
    size: 1,
    capacity: 10,
    guests: ['demo-3'],
  },
  {
    id: 'demo-table-4',
    name: 'Table 4 - VIPs',
    x: 500,
    y: 200,
    rotation: 0,
    shape: 'oval',
    size: 1.1,
    capacity: 6,
    guests: ['demo-6'],
  },
];

const DEMO_GUESTS: Guest[] = [
  { id: 'demo-1', fullName: 'Adaeze Okonkwo', group: 'Family', tableId: 'demo-table-1', rsvpStatus: 'confirmed' },
  { id: 'demo-2', fullName: 'Chukwuemeka Eze', group: 'Friends', tableId: 'demo-table-2', rsvpStatus: 'confirmed' },
  { id: 'demo-3', fullName: 'Ngozi Abubakar', group: 'Work', tableId: 'demo-table-3', rsvpStatus: 'pending' },
  { id: 'demo-4', fullName: 'Oluwaseun Adeleke', group: 'Family', tableId: null, rsvpStatus: 'declined' },
  { id: 'demo-5', fullName: 'Funke Balogun', group: 'Friends', tableId: 'demo-table-1', rsvpStatus: 'confirmed' },
  { id: 'demo-6', fullName: 'Ibrahim Yusuf', group: 'Work', tableId: 'demo-table-4', rsvpStatus: 'pending' },
];

const DEMO_FIXED_ELEMENTS: FixedElement[] = [
  { id: 'demo-stage', name: 'Main Stage', type: 'stage', x: 250, y: 0, width: 200, height: 60, rotation: 0 },
  { id: 'demo-dance', name: 'Dance Floor', type: 'danceFloor', x: 200, y: 350, width: 150, height: 100, rotation: 0 },
];

export const useSeatingChart = (eventId?: string) => {
  const { user } = useAuth();
  const { handleError, handleSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // Check if this is a demo/placeholder event
  const isPlaceholderEvent = eventId === "sample-event-id" || !eventId || !user?.id;

  // Fetch seating arrangement for an event (using in-memory storage)
  const seatingQuery = useQuery({
    queryKey: ["seating-arrangement", eventId],
    queryFn: async () => {
      if (!eventId || !user?.id) {
        return { tables: [], fixedElements: [] };
      }

      const key = `${eventId}-${user.id}`;
      return seatingArrangements.get(key) || { tables: [], fixedElements: [] };
    },
    enabled: !!eventId && !!user?.id,
  });

  // Fetch guests for the event
  const guestsQuery = useQuery({
    queryKey: ["guests", eventId],
    queryFn: async () => {
      if (!eventId || !user?.id) return [];

      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;

      return data.map(guest => ({
        id: guest.id,
        fullName: guest.name || "Unknown",
        group: "General",
        tableId: guest.table_number ? `table-${guest.table_number}` : null,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
        rsvpStatus: guest.rsvp_status as 'pending' | 'confirmed' | 'declined',
      })) as Guest[];
    },
    enabled: !!eventId && !!user?.id,
  });

  // Use demo data for placeholder events, real data otherwise
  const tables = isPlaceholderEvent ? DEMO_TABLES : (seatingQuery.data?.tables || []);
  const fixedElements = isPlaceholderEvent ? DEMO_FIXED_ELEMENTS : (seatingQuery.data?.fixedElements || []);
  const guests = isPlaceholderEvent ? DEMO_GUESTS : (guestsQuery.data || []);

  // Save seating arrangement (in-memory)
  const saveSeatingArrangement = useMutation({
    mutationFn: async ({ tables, fixedElements }: { tables: TableItem[]; fixedElements: FixedElement[] }) => {
      if (!eventId || !user?.id) throw new Error("Event ID and user required");

      const key = `${eventId}-${user.id}`;
      seatingArrangements.set(key, { tables, fixedElements });
      return { tables, fixedElements };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-arrangement", eventId] });
      handleSuccess("Seating arrangement saved successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "saving seating arrangement");
    },
  });

  // Add table
  const addTableMutation = useMutation({
    mutationFn: async (table: Omit<TableItem, 'id'>) => {
      const currentArrangement = seatingQuery.data;

      const newTable: TableItem = {
        ...table,
        id: `table-${Date.now()}`,
        guests: [],
      };

      const updatedTables = [...(currentArrangement?.tables || []), newTable];

      await saveSeatingArrangement.mutateAsync({
        tables: updatedTables,
        fixedElements: currentArrangement?.fixedElements || [],
      });

      return newTable;
    },
    onSuccess: () => {
      handleSuccess("Table added successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "adding table");
    },
  });

  // Update table
  const updateTableMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TableItem> }) => {
      const currentArrangement = seatingQuery.data;

      const updatedTables = (currentArrangement?.tables || []).map(table => 
        table.id === id ? { ...table, ...updates } : table
      );

      await saveSeatingArrangement.mutateAsync({
        tables: updatedTables,
        fixedElements: currentArrangement?.fixedElements || [],
      });
    },
    onSuccess: () => {
      handleSuccess("Table updated successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "updating table");
    },
  });

  // Remove table
  const removeTableMutation = useMutation({
    mutationFn: async (id: string) => {
      const currentArrangement = seatingQuery.data;

      const updatedTables = (currentArrangement?.tables || []).filter(table => table.id !== id);

      await saveSeatingArrangement.mutateAsync({
        tables: updatedTables,
        fixedElements: currentArrangement?.fixedElements || [],
      });
    },
    onSuccess: () => {
      handleSuccess("Table removed successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "removing table");
    },
  });

  // Assign guest to table
  const assignGuestToTableMutation = useMutation({
    mutationFn: async ({ guestId, tableId }: { guestId: string; tableId: string | null }) => {
      // Extract table number from tableId (e.g., "table-123" -> 123)
      const tableNumber = tableId ? parseInt(tableId.replace('table-', ''), 10) || null : null;
      
      const { error } = await supabase
        .from("guests")
        .update({ table_number: tableNumber })
        .eq("id", guestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
      handleSuccess("Guest assigned successfully!", "Success");
    },
    onError: (error) => {
      handleError(error, "assigning guest");
    },
  });

  return {
    tables,
    fixedElements,
    guests,
    loading: isPlaceholderEvent ? false : (seatingQuery.isLoading || guestsQuery.isLoading),
    addTable: (table: Omit<TableItem, 'id'>) => addTableMutation.mutate(table),
    removeTable: (id: string) => removeTableMutation.mutate(id),
    updateTable: ({ id, updates }: { id: string; updates: Partial<TableItem> }) => updateTableMutation.mutate({ id, updates }),
    assignGuestToTable: (guestId: string, tableId: string | null) => assignGuestToTableMutation.mutate({ guestId, tableId }),
    saveSeatingArrangement,
  };
};
