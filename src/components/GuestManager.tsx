
import React from 'react';
import { useGuestManager } from './guest-management/useGuestManager';
import GuestListHeader from './guest-management/GuestListHeader';
import GuestStatsCards from './guest-management/GuestStatsCards';
import GuestListControls from './guest-management/GuestListControls';
import GuestTable from './guest-management/GuestTable';
import AddGuestDialog from './guest-management/AddGuestDialog';
import EditGuestDialog from './guest-management/EditGuestDialog';
import GuestFilterSheet from './guest-management/GuestFilterSheet';
import { NewGuestForm, UpdateGuestForm } from './guest-management/types';

interface GuestManagerProps {
  eventId: string;
}

const GuestManager = ({ eventId }: GuestManagerProps) => {
  const {
    guests,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGroup,
    setFilterGroup,
    selectedGuests,
    setSelectedGuests,
    editingGuest,
    setEditingGuest,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    handleAddGuest,
    handleEditGuest,
    handleRemoveGuest,
    handleBulkDelete,
    handleSendInvitations,
    getFilteredGuests,
    getRsvpStats,
    isSendingInvitation,
  } = useGuestManager(eventId);

  const filteredGuests = getFilteredGuests();
  const stats = getRsvpStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuestListHeader
        onAddGuest={() => setShowAddDialog(true)}
        onSendInvitations={handleSendInvitations}
        selectedCount={selectedGuests.length}
        onBulkDelete={handleBulkDelete}
        isSendingInvitation={isSendingInvitation}
      />

      <GuestStatsCards stats={stats} />

      <GuestListControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        totalGuests={filteredGuests.length}
      />

      <GuestTable
        guests={filteredGuests}
        selectedGuests={selectedGuests}
        onSelectGuests={setSelectedGuests}
        onEditGuest={(guest) => {
          setEditingGuest(guest);
          setShowEditDialog(true);
        }}
        onRemoveGuest={handleRemoveGuest}
      />

      <AddGuestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(guestData: NewGuestForm) => {
          handleAddGuest(guestData);
        }}
      />

      <EditGuestDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        guest={editingGuest}
        onSubmit={(guestData: UpdateGuestForm) => {
          handleEditGuest(guestData);
        }}
      />

      <GuestFilterSheet
        filterGroup={filterGroup}
        onFilterGroupChange={setFilterGroup}
        guests={guests}
      />
    </div>
  );
};

export default GuestManager;
