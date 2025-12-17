<template>
  <p>Processando login, aguarde...</p>
</template>

<script setup lang="ts">
import { userManager, type LoginState } from '@/auth';
import { useEnvConfig } from '@/utils/env-config';
import { onMounted } from 'vue';

onMounted(async () => {
  await userManager.signinRedirectCallback();
  const user = await userManager.getUser();
  const state = user?.state as LoginState | undefined;

  const env = useEnvConfig();
  let base = env.APP_BASE_URL || '';
  base = base.replace(/\/$/, "");

  if (state?.returnUrl) {
    window.location.href = base + state.returnUrl;
  } else {
    window.location.href = base + "/seguro";
  }
});

</script>

<style lang="css" scoped>
p {
  color: var(--creme);
  font-size: 1.25rem;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 30rem;
}
</style>
