import client from "./client";
import type { Pet } from "@/types";

export const petsApi = {
  getAll: () => client.get<Pet[]>("/pets"),
  getOne: (id: string) => client.get<Pet>(`/pets/${id}`),
  create: (data: Partial<Pet>) => client.post<Pet>("/pets", data),
  update: (id: string, data: Partial<Pet>) =>
    client.put<Pet>(`/pets/${id}`, data),
  remove: (id: string) => client.delete(`/pets/${id}`),
};
