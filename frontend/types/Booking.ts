// types/Booking.ts
export interface Booking {
  _id: string;
  customerName: string;
  contact: string;
  startTime: string; // ISO string; convert to Date when needed
  endTime: string;   // ISO string; convert to Date when needed
  numberOfSessions: number;
}
