<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>
    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >
        <!-- Input section -->
        <div class="flex flex-col space-y-4 w-1/2">
          <label for="input1" class="text-lg font-bold">Sequence: </label>
          <input
            id="input1"
            type="text"
            class="input input-primary"
            placeholder="Enter Sequence"
            v-model.value="sequenceStore.sequence"
          />

          <label for="input2" class="text-lg font-bold">Pattern:</label>
          <input
            id="input2"
            type="text"
            class="input input-primary"
            placeholder="Enter Pattern"
            v-model.value="sequenceStore.pattern"
          />
          <button @click="sequenceStore.computeProof()" class="btn">Compute Proof</button>
        </div>

        <!-- Proof section -->
        <div
          id="proofs-section"
          class="w-1/2 flex flex-col space-y-4 bg-center bg-cover"
        >
          <div
            v-if="sequenceStore.proof"
            class="card w-full glass backdrop-blur-md"
          >
            <div class="card-body">
              <h2 class="card-title">Proof Computed</h2>
              <!-- <p>
                TODO: proofmetadata
                Proof Generated in {{ sequenceStore.proof.computationTime }} ms
              </p> -->
              <p>Public input (Pattern): {{ sequenceStore.pattern }}</p>
              <p>Private input: {{ sequenceStore.sequence }}</p>
              <div class="card-actions justify-end">
                <button @click="sequenceStore.verify" class="btn btn-primary">
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

import { useSequence } from "./store/sequence/sequence.index";
const sequenceStore = useSequence();

const defaultFunction = () => {
  console.log("default function");
};



</script>