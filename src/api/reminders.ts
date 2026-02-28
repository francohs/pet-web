import client from "./client";
import type { Reminder, CreateReminderPayload } from "@/types";

export const remindersApi = {
  getAll: () => client.get<Reminder[]>("/reminders"),
  getByPet: (petId: string) =>
    client.get<Reminder[]>(`/reminders/pet/${petId}`),
  create: (data: CreateReminderPayload) =>
    client.post<Reminder>("/reminders", data),
  update: (id: string, data: Partial<Reminder>) =>
    client.put<Reminder>(`/reminders/${id}`, data),
  remove: (id: string) => client.delete(`/reminders/${id}`),
};
