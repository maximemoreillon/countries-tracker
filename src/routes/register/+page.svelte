<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete"
  import Button, { Label, Icon } from "@smui/button"
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
  <h2>Where are you from?</h2>
  <form on:submit|preventDefault={createItem}>
    <Autocomplete options={countryNames} bind:value label="Countriy" />
    <Button type="submit" variant="unelevated">
      <Icon class="material-icons">check</Icon>
      <Label>Register</Label>
    </Button>
  </form>
</div>

<style>
  .wrapper {
    margin-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form {
    display: flex;
    gap: 1em;
    align-items: center;
  }

  h2 {
    font-size: 200%;
  }
</style>
