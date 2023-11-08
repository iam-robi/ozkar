<template>
    <div class="p-4">
      <div class="flex gap-4"> <!-- Flex container -->
        <!-- Connect Wallet -->
        <ConnectWallet></ConnectWallet>
  
        <!-- Theme Selector -->
        <select class="select w-full max-w-xs" v-model="colorMode.preference">
          <option disabled selected>Theme</option>
          <option v-for="theme in themes" :key="theme">{{ theme }}</option>
        </select>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import ConnectWallet from "../wallet/ConnectWallet.vue";
  const colorMode = useColorMode();
  const themes = [
    "system",
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];
  </script>