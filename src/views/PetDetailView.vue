<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <Button variant="outline" size="sm" @click="router.push('/pets')">
          ← Back
        </Button>
        <h1 class="text-2xl font-semibold">
          {{ speciesEmoji(pet?.species ?? "") }} {{ pet?.name }}
        </h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Species</CardDescription>
            <CardTitle class="text-lg">{{ pet?.species }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Breed</CardDescription>
            <CardTitle class="text-lg">{{ pet?.breed || "Unknown" }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Birth Date</CardDescription>
            <CardTitle class="text-lg">
              {{ pet?.birthDate ? formatDate(pet.birthDate) : "Unknown" }}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="appointmentsLoading" class="text-sm text-neutral-500">
              Loading...
            </div>
            <div
              v-else-if="!appointments?.length"
              class="text-sm text-neutral-500"
            >
              No appointments yet
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="appointment in appointments"
                :key="appointment._id"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium">{{ appointment.reason }}</p>
                  <p class="text-xs text-neutral-500">
                    {{ formatDate(appointment.date) }}
                  </p>
                </div>
                <Badge :variant="statusVariant(appointment.status)">
                  {{ appointment.status }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="remindersLoading" class="text-sm text-neutral-500">
              Loading...
            </div>
            <div
              v-else-if="!reminders?.length"
              class="text-sm text-neutral-500"
            >
              No reminders yet
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="reminder in reminders"
                :key="reminder._id"
                class="flex items-center justify-between"
                :class="reminder.done ? 'opacity-50' : ''"
              >
                <div>
                  <p class="text-sm font-medium">{{ reminder.description }}</p>
                  <p class="text-xs text-neutral-500">
                    Due {{ formatDate(reminder.dueDate) }}
                  </p>
                </div>
                <Badge variant="outline">{{ reminder.type }}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import AppLayout from "@/components/AppLayout.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { petsApi } from "@/api/pets";
import { appointmentsApi } from "@/api/appointments";
import { remindersApi } from "@/api/reminders";

const route = useRoute();
const router = useRouter();
const petId = route.params.id as string;

const { data: pet } = useQuery({
  queryKey: ["pets", petId],
  queryFn: () => petsApi.getOne(petId).then((r) => r.data),
});

const { data: appointments, isLoading: appointmentsLoading } = useQuery({
  queryKey: ["appointments", petId],
  queryFn: () => appointmentsApi.getByPet(petId).then((r) => r.data),
});

const { data: reminders, isLoading: remindersLoading } = useQuery({
  queryKey: ["reminders", petId],
  queryFn: () => remindersApi.getByPet(petId).then((r) => r.data),
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function speciesEmoji(species: string) {
  const map: Record<string, string> = {
    dog: "🐶",
    cat: "🐱",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐰",
  };
  return map[species.toLowerCase()] ?? "🐾";
}

function statusVariant(status: string) {
  if (status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  return "outline";
}
</script>
