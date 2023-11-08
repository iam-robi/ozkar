// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import type { AccountState } from '~/store/account/account.types';
import { useNuxtApp } from "#app";

export const useAccount = defineStore("account", {
  state: (): AccountState => ({

    loading: false,
    connected: false,
    provider: null,
    balance: null,
    transaction: null,
    minaAccounts: null,
    minaAddress: null,
    minaInstalled: false,
    minaLoggedIn: false,
  }),
  actions: {
    minaSignIn: async function () {
        const nuxtApp = useNuxtApp()

      const { $mina } = useNuxtApp();
      console.log($mina);
      try {
        this.minaAccounts = await $mina.requestAccounts();
      } catch (err) {
        console.log(err);
      }
      this.minaLoggedIn = true;
    },
  }
});