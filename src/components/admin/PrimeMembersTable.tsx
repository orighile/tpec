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
import { Switch } from '@/components/ui/switch';
import type { PrimeMember } from '@/hooks/useAdminData';

interface PrimeMembersTableProps {
  members: PrimeMember[];
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const PrimeMembersTable = ({ members, onToggleStatus }: PrimeMembersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No Prime members yet
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.business_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {member.membership_type}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{member.category || '-'}</TableCell>
                <TableCell>{member.location || '-'}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      member.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {member.payment_status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={member.is_active}
                    onCheckedChange={(checked) => onToggleStatus(member.id, checked)}
                  />
                </TableCell>
                <TableCell>{format(new Date(member.created_at), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
