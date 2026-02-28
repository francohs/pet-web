import client from "./client";
import type { Appointment, CreateAppointmentPayload } from "@/types";

export const appointmentsApi = {
  getAll: () => client.get<Appointment[]>("/appointments"),
  getByPet: (petId: string) =>
    client.get<Appointment[]>(`/appointments/pet/${petId}`),
  create: (data: CreateAppointmentPayload) =>
    client.post<Appointment>("/appointments", data),
  update: (id: string, data: Partial<Appointment>) =>
    client.put<Appointment>(`/appointments/${id}`, data),
  remove: (id: string) => client.delete(`/appointments/${id}`),
};
