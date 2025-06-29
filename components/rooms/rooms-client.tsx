"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Plus, PenSquare, Trash2 } from "lucide-react"
import { RoomForm } from "@/components/rooms/room-form"
import { TableLayout } from "@/components/shared/table-layout"
import { MobileCard } from "@/components/shared/mobile-card"
import { useRouter } from "next/navigation"

interface Room {
  id: string
  roomNo: string
  roomType: string
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  reservedBeds: number
}

export function RoomsClient() {
  const router = useRouter()
  
  // Mock data for rooms
  const initialRooms = [
    {
      id: '1',
      roomNo: '1',
      roomType: 'Delux',
      totalBeds: 3,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '2',
      roomNo: '2',
      roomType: 'Standard',
      totalBeds: 4,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '3',
      roomNo: '3',
      roomType: 'Private',
      totalBeds: 1,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '4',
      roomNo: '4',
      roomType: 'Suite',
      totalBeds: 2,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '5',
      roomNo: '5',
      roomType: 'Ward',
      totalBeds: 16,
      availableBeds: 6,
      occupiedBeds: 10,
      reservedBeds: 0
    },
    {
      id: '6',
      roomNo: '1',
      roomType: 'Standard',
      totalBeds: 4,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 1
    },
    {
      id: '7',
      roomNo: '2',
      roomType: 'Ward',
      totalBeds: 16,
      availableBeds: 3,
      occupiedBeds: 13,
      reservedBeds: 0
    },
    {
      id: '8',
      roomNo: '3',
      roomType: 'Delux',
      totalBeds: 3,
      availableBeds: 2,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '9',
      roomNo: '4',
      roomType: 'Private',
      totalBeds: 1,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    },
    {
      id: '10',
      roomNo: '5',
      roomType: 'Suite',
      totalBeds: 2,
      availableBeds: 0,
      occupiedBeds: 1,
      reservedBeds: 0
    }
  ]

  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  useEffect(() => {
    // Filter rooms based on search term
    const filtered = rooms.filter((room) =>
      room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRooms(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, rooms])

  const handleSubmit = async (data: any) => {
    if (editingRoom) {
      // Update existing room
      setRooms(prev => 
        prev.map(room => 
          room.id === editingRoom.id ? { ...room, ...data } : room
        )
      )
    } else {
      // Add new room
      const newRoom = {
        id: Math.random().toString(36).substr(2, 9),
        ...data
      }
      setRooms(prev => [...prev, newRoom])
    }
    
    setIsFormOpen(false)
    setEditingRoom(null)
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id))
  }
  
  const handleRowClick = (roomId: string) => {
    router.push(`/rooms/${roomId}/beds`)
  }

  // Pagination logic
  const totalRecords = filteredRooms.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex)

  // Add Button Component
  const addButtonComponent = (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRoom ? 'Edit Room' : 'Add Room'}</DialogTitle>
        </DialogHeader>
        <RoomForm
          initialData={editingRoom || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingRoom(null)
          }}
        />
      </DialogContent>
    </Dialog>
  )

  // Table Header
  const tableHeader = (
    <TableRow>
      <TableHead>Room No.</TableHead>
      <TableHead>Room type</TableHead>
      <TableHead>Total Beds</TableHead>
      <TableHead>Available Beds</TableHead>
      <TableHead>Occupied Beds</TableHead>
      <TableHead>Reserved Beds</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  )

  // Table Body
  const tableBody = paginatedRooms.map((room) => (
    <TableRow 
      key={room.id} 
      className="bg-[#f4f3ff] rounded-[10px] my-[10px] cursor-pointer"
      onClick={() => handleRowClick(room.id)}
    >
      <TableCell className="text-base text-black font-sf-pro">
        {room.roomNo}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {room.roomType}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {room.totalBeds}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {room.availableBeds}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {room.occupiedBeds}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {room.reservedBeds}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
            <PenSquare className="w-5 h-5 text-[#7165e1]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))

  // Mobile Cards
  const mobileCards = paginatedRooms.map((room) => (
    <div key={room.id} onClick={() => handleRowClick(room.id)}>
      <MobileCard
        title={`Room ${room.roomNo}`}
        subtitle={room.roomType}
        actions={
          <div onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(room)}>
              <PenSquare className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(room.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      >
        <div className="flex justify-between">
          <span className="text-gray-600">Total Beds:</span>
          <span>{room.totalBeds}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available:</span>
          <span>{room.availableBeds}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Occupied:</span>
          <span>{room.occupiedBeds}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Reserved:</span>
          <span>{room.reservedBeds}</span>
        </div>
      </MobileCard>
    </div>
  ))

  return (
    <TableLayout
      title="Rooms"
      addButtonComponent={addButtonComponent}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      recordsPerPage={recordsPerPage}
      setRecordsPerPage={setRecordsPerPage}
      totalRecords={totalRecords}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      tableHeader={tableHeader}
      tableBody={tableBody}
      mobileCards={mobileCards}
      emptyMessage="No rooms found. Add your first room to get started."
    />
  )
}

// Helper component for table header
function TableHead({ children, className = "" }) {
  return (
    <th className={`text-[#888888] text-lg font-sf-pro font-medium ${className}`}>
      {children}
    </th>
  )
}