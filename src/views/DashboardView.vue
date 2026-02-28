<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-semibold">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Total Pets</CardDescription>
            <CardTitle class="text-3xl">
              {{ petsLoading ? "..." : (pets?.length ?? 0) }}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Upcoming Appointments</CardDescription>
            <CardTitle class="text-3xl">
              {{ appointmentsLoading ? "..." : upcomingAppointments }}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Pending Reminders</CardDescription>
            <CardTitle class="text-3xl">
              {{ remindersLoading ? "..." : pendingReminders }}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="appointmentsLoading" class="text-sm text-neutral-500">
              Loading...
            </div>
            <div
              v-else-if="!recentAppointments.length"
              class="text-sm text-neutral-500"
            >
              No appointments yet
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="appointment in recentAppointments"
                :key="appointment._id"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium">{{ appointment.reason }}</p>
                  <p class="text-xs text-neutral-500">
                    {{ appointment.petId.name }} ·
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
            <CardTitle class="text-base">Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="remindersLoading" class="text-sm text-neutral-500">
              Loading...
            </div>
            <div
              v-else-if="!pendingRemindersList.length"
              class="text-sm text-neutral-500"
            >
              No pending reminders
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="reminder in pendingRemindersList"
                :key="reminder._id"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium">{{ reminder.description }}</p>
                  <p class="text-xs text-neutral-500">
                    {{ reminder.petId.name }} ·
                    {{ formatDate(reminder.dueDate) }}
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
import { computed } from "vue";
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
import { petsApi } from "@/api/pets";
import { appointmentsApi } from "@/api/appointments";
import { remindersApi } from "@/api/reminders";

const { data: pets, isLoading: petsLoading } = useQuery({
  queryKey: ["pets"],
  queryFn: () => petsApi.getAll().then((r) => r.data),
});

const { data: appointments, isLoading: appointmentsLoading } = useQuery({
  queryKey: ["appointments"],
  queryFn: () => appointmentsApi.getAll().then((r) => r.data),
});

const { data: reminders, isLoading: remindersLoading } = useQuery({
  queryKey: ["reminders"],
  queryFn: () => remindersApi.getAll().then((r) => r.data),
});

const upcomingAppointments = computed(
  () => appointments.value?.filter((a) => a.status === "scheduled").length ?? 0,
);

const recentAppointments = computed(
  () => appointments.value?.slice(0, 5) ?? [],
);

const pendingReminders = computed(
  () => reminders.value?.filter((r) => !r.done).length ?? 0,
);

const pendingRemindersList = computed(
  () => reminders.value?.filter((r) => !r.done).slice(0, 5) ?? [],
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusVariant(status: string) {
  if (status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  return "outline";
}
</script>
