<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete"
  import Button, { Label, Icon } from "@smui/button"
  import countries from "$lib/countries"
  import { collection, addDoc, getFirestore } from "firebase/firestore"
  import { goto } from "$app/navigation"
  import CircularProgress from "@smui/circular-progress"

  const countryNames = countries.map((c) => c.Country)
  let country: String | undefined
  let loading = false

  const createItem = async () => {
    if (!country) return
    loading = true
    try {
      const firestore = getFirestore()
      const collectionRef = collection(firestore, "entries")
      await addDoc(collectionRef, { country })
      goto(`/?country=${country}`)
    } catch (error) {
      console.error(error)
      alert(error)
    } finally {
      loading = false
    }
  }
</script>

<div class="wrapper">
  <h2>Where are you from?</h2>
  <form on:submit|preventDefault={createItem}>
    <Autocomplete
      options={countryNames}
      bind:value={country}
      label="Countriy"
    />
    <Button type="submit" variant="unelevated" disabled={loading}>
      <!-- <Icon class="material-icons">check</Icon> -->
      {#if loading}
        <CircularProgress style="height: 1.5em; width: 1.5em;" indeterminate />
      {:else}
        <Label>OK</Label>
      {/if}
    </Button>
  </form>
  <p>
    <a href="/">See the map</a>
  </p>
</div>

<style>
  .wrapper {
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
