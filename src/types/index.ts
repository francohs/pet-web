export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  ownerId: string;
}

export interface Appointment {
  _id: string;
  petId: Pet;
  ownerId: string;
  date: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

export interface Reminder {
  _id: string;
  petId: Pet;
  ownerId: string;
  type: "vaccine" | "medication";
  dueDate: string;
  description: string;
  done: boolean;
}

export interface AuthResponse {
  access_token: string;
}

export interface CreateAppointmentPayload {
  petId: string;
  date: string;
  reason: string;
  notes: string;
}

export interface CreateReminderPayload {
  petId: string;
  type: string;
  dueDate: string;
  description: string;
}
