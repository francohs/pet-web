<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Appointments</h1>
        <Button @click="showDialog = true">Add Appointment</Button>
      </div>

      <div v-if="isLoading" class="text-sm text-neutral-500">Loading...</div>

      <div
        v-else-if="!appointments?.length"
        class="text-center py-12 text-neutral-500"
      >
        No appointments yet. Schedule your first one!
      </div>

      <Card v-else>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="appointment in appointments"
                :key="appointment._id"
              >
                <TableCell class="font-medium">
                  {{ appointment.petId.name }}
                </TableCell>
                <TableCell>{{ appointment.reason }}</TableCell>
                <TableCell>{{ formatDate(appointment.date) }}</TableCell>
                <TableCell>
                  <Badge :variant="statusVariant(appointment.status)">
                    {{ appointment.status }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Button
                      v-if="appointment.status === 'scheduled'"
                      variant="outline"
                      size="sm"
                      @click="handleComplete(appointment._id)"
                    >
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-red-500 hover:text-red-600"
                      @click="handleDelete(appointment._id)"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="showDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule an appointment</DialogTitle>
          <DialogDescription
            >Fill in the details below to schedule an
            appointment.</DialogDescription
          >
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleCreate">
          <div class="space-y-2">
            <Label>Pet</Label>
            <select
              v-model="form.petId"
              required
              class="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="" disabled>Select a pet</option>
              <option v-for="pet in pets" :key="pet._id" :value="pet._id">
                {{ pet.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Reason</Label>
            <Input
              v-model="form.reason"
              placeholder="Annual checkup"
              required
            />
          </div>
          <div class="space-y-2">
            <Label>Date</Label>
            <Input v-model="form.date" type="datetime-local" required />
          </div>
          <div class="space-y-2">
            <Label>Notes</Label>
            <Input v-model="form.notes" placeholder="Optional notes" />
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Scheduling..." : "Schedule" }}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import AppLayout from "@/components/AppLayout.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appointmentsApi } from "@/api/appointments";
import { petsApi } from "@/api/pets";

const queryClient = useQueryClient();
const showDialog = ref(false);
const loading = ref(false);

const form = reactive({
  petId: "",
  reason: "",
  date: "",
  notes: "",
});

const { data: appointments, isLoading } = useQuery({
  queryKey: ["appointments"],
  queryFn: () => appointmentsApi.getAll().then((r) => r.data),
});

const { data: pets } = useQuery({
  queryKey: ["pets"],
  queryFn: () => petsApi.getAll().then((r) => r.data),
});

const { mutate: createAppointment } = useMutation({
  mutationFn: (data: typeof form) => appointmentsApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
    showDialog.value = false;
    Object.assign(form, { petId: "", reason: "", date: "", notes: "" });
  },
});

const { mutate: updateAppointment } = useMutation({
  mutationFn: ({ id, data }: { id: string; data: object }) =>
    appointmentsApi.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  },
});

const { mutate: deleteAppointment } = useMutation({
  mutationFn: (id: string) => appointmentsApi.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  },
});

async function handleCreate() {
  loading.value = true;
  try {
    createAppointment(form);
  } finally {
    loading.value = false;
  }
}

function handleComplete(id: string) {
  updateAppointment({ id, data: { status: "completed" } });
}

function handleDelete(id: string) {
  deleteAppointment(id);
}

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
