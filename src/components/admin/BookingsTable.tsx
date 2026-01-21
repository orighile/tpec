import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, Clock, X, Trash2 } from 'lucide-react';
import type { ConsultationBooking } from '@/hooks/useAdminData';

interface BookingsTableProps {
  bookings: ConsultationBooking[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const BookingsTable = ({ bookings, onUpdateStatus, onDelete }: BookingsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No consultation bookings yet
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell className="capitalize">
                  {booking.consultation_type.replace(/-/g, ' ')}
                </TableCell>
                <TableCell>
                  {format(new Date(booking.booking_date), 'MMM d, yyyy')} at {booking.booking_time}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[booking.status] || 'bg-gray-100 text-gray-800'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'confirmed')}>
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'completed')}>
                        <Clock className="mr-2 h-4 w-4" /> Mark Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(booking.id, 'cancelled')}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(booking.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
