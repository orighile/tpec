import React, { useState } from "react";
import { useSeatingChart } from "@/hooks/useSeatingChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Table, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SeatingPlanner = ({ eventId }: { eventId?: string }) => {
  const { toast } = useToast();
  const {
    tables,
    guests,
    loading,
    addTable,
    removeTable,
    assignGuestToTable,
  } = useSeatingChart(eventId);

  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTable, setNewTable] = useState({
    name: "",
    shape: "round" as "round" | "rectangle" | "oval" | "square",
    capacity: 8,
    size: 100,
  });

  const handleAddTable = () => {
    if (!newTable.name) {
      toast({
        title: "Missing information",
        description: "Please provide a table name",
        variant: "destructive",
      });
      return;
    }

    const tableData = {
      name: newTable.name,
      x: 200,
      y: 200,
      rotation: 0,
      shape: newTable.shape,
      size: newTable.size,
      capacity: newTable.capacity,
      guests: [],
    };

    addTable(tableData);
    setNewTable({ name: "", shape: "round", capacity: 8, size: 100 });
    setIsAddingTable(false);
  };

  const handleRemoveTable = (tableId: string) => {
    removeTable(tableId);
  };

  const getUnassignedGuests = () => {
    return guests.filter(guest => !guest.tableId);
  };

  const getAssignedGuests = (tableId: string) => {
    return guests.filter(guest => guest.tableId === tableId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse">Loading seating chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Seating Chart Planner
            </CardTitle>
            <Button onClick={() => setIsAddingTable(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingTable && (
            <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Table Name</Label>
                  <Input
                    value={newTable.name}
                    onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                    placeholder="e.g., Table 1"
                  />
                </div>
                <div>
                  <Label>Shape</Label>
                  <Select
                    value={newTable.shape}
                    onValueChange={(value: "round" | "rectangle" | "oval" | "square") => 
                      setNewTable({ ...newTable, shape: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="oval">Oval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 8 })}
                    min="2"
                    max="20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTable}>Add Table</Button>
                <Button variant="outline" onClick={() => setIsAddingTable(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tables */}
            <div>
              <h3 className="font-medium mb-3">Tables ({tables.length})</h3>
              <div className="space-y-2">
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <div key={table.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{table.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getAssignedGuests(table.id).length}/{table.capacity} seats
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{table.shape}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveTable(table.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tables added yet
                  </div>
                )}
              </div>
            </div>

            {/* Unassigned Guests */}
            <div>
              <h3 className="font-medium mb-3">
                Unassigned Guests ({getUnassignedGuests().length})
              </h3>
              <div className="space-y-2">
                {getUnassignedGuests().length > 0 ? (
                  getUnassignedGuests().map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{guest.fullName}</div>
                        <div className="text-sm text-muted-foreground">{guest.group}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value=""
                          onValueChange={(tableId) => {
                            if (tableId) {
                              assignGuestToTable(guest.id, tableId);
                            }
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem 
                                key={table.id} 
                                value={table.id}
                                disabled={getAssignedGuests(table.id).length >= table.capacity}
                              >
                                {table.name} ({getAssignedGuests(table.id).length}/{table.capacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    All guests have been assigned
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatingPlanner;