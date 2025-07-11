<script setup lang="ts">
const authStore = useAuth();

const props = defineProps<{
  selectedIndex: number;
}>();
const emit = defineEmits<{
  select: [index: number];
}>();

const userFirstLetter = computed(() => {
  return (
    authStore.user.value?.name?.charAt(0).toUpperCase() ||
    authStore.user.value?.email?.charAt(0).toUpperCase() ||
    "U"
  );
});
</script>

<template>
  <div
    class="absolute top-0 bottom-0 left-0 flex w-64 flex-col rounded-l-xl bg-slate-50 px-0.5 py-3"
  >
    <p class="ml-3 text-sm font-medium text-gray-400">Account</p>

    <div class="ml-3 flex items-center">
      <div v-if="authStore.dbUser.value?.avatar"></div>
      <div
        v-else
        class="flex size-5 items-center justify-center rounded-full bg-white text-xs text-gray-500 shadow-xs"
      >
        {{ userFirstLetter }}
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-700">
          {{ authStore.user.value?.name }}
        </p>
        <p class="text-xs font-normal text-gray-400">
          {{ authStore.user.value?.email }}
        </p>
      </div>
    </div>
    <div class="font-normal text-gray-700">
      <DefaultPanelItem
        title="My Account"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 0"
        @click="emit('select', 0)"
      >
        <UIcon name="i-heroicons-user-circle" class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Settings"
        class="mb-0.5 w-full pl-3"
        :selected="selectedIndex === 1"
        @click="emit('select', 1)"
      >
        <UIcon name="i-heroicons-adjustments-horizontal" class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Notifications"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 2"
        @click="emit('select', 2)"
      >
        <UIcon name="i-heroicons-bell" class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Connections"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 3"
        @click="emit('select', 3)"
      >
        <UIcon name="i-heroicons-at-symbol" class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Workspaces"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 4"
        @click="emit('select', 4)"
      >
        <UIcon name="i-heroicons-globe-alt" class="size-5" />
      </DefaultPanelItem>
    </div>
    <p class="mb-1 ml-3 text-sm font-medium text-gray-400">Workspace</p>
    <div class="font-normal text-gray-700">
      <DefaultPanelItem
        title="Settings"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 5"
        @click="emit('select', 5)"
      >
        <Cog8ToothIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="People"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 6"
        @click="emit('select', 6)"
      >
        <UsersIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Upgrade"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 7"
        @click="emit('select', 7)"
      >
        <ArrowUpCircleIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Sites"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 8"
        @click="emit('select', 8)"
      >
        <CursorArrowRaysIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Security"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 9"
        @click="emit('select', 9)"
      >
        <KeyIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Identity & provisioning"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 10"
        @click="emit('select', 10)"
      >
        <ShieldCheckIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Connections"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 11"
        @click="emit('select', 11)"
      >
        <Squares2X2Icon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Import"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 12"
        @click="emit('select', 12)"
      >
        <ArrowDownTrayIcon class="size-5" />
      </DefaultPanelItem>
    </div>
  </div>
</template>
