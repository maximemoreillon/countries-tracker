<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete"
  import IconButton from "@smui/icon-button"
  import countries from "$lib/countries"
  import { collection, addDoc, getFirestore } from "firebase/firestore"
  import { goto } from "$app/navigation"

  const countryNames = countries.map((c) => c.Country)
  let value: String | undefined

  const createItem = async () => {
    if (!value) return
    try {
      const firestore = getFirestore()
      const collectionRef = collection(firestore, "entries")
      await addDoc(collectionRef, { country: value })
      goto("/")
    } catch (error) {
      console.error(error)
    }
  }
</script>

<div class="wrapper">
  <form on:submit|preventDefault={createItem}>
    <Autocomplete options={countryNames} bind:value label="Countriy" />
    <IconButton class="material-icons" type="submit">check</IconButton>
  </form>
</div>

<style>
  .wrapper {
    margin-top: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
