<template>
    <div >
    <nuxt-link v-if="!$mina" to="https://www.aurowallet.com" target="_blank">
      <button class="btn">Install Auro Wallet</button>
    </nuxt-link>
    <button v-if="$mina && !accountStore.minaLoggedIn" @click="accountStore.minaSignIn()" class="btn">Login</button>
    <button v-if="accountStore.minaLoggedIn" class="btn">{{accountStore.minaAccounts ? `${accountStore.minaAccounts[0].slice(0,6)}...${accountStore.minaAccounts[0].slice(-4)}` : ''}}</button>
    </div>
  </template>
  <script setup>
  import {useAccount} from "../../store/account/account.index";
  
  const accountStore = useAccount()
  </script>
  <style scoped>
 
  </style>