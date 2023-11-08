import {defineNuxtRouteMiddleware} from "#imports";
import {useAccount} from "~/store/account/account.index";
import {useNuxtApp} from "#app";
export default defineNuxtRouteMiddleware(async (to, from)=> {
    const accountStore = useAccount();
    const {$mina} = useNuxtApp()
    if(!$mina){
        accountStore.minaInstalled = false
    }
    if($mina){
        accountStore.minaInstalled = true
        console.log($mina)
    }

})