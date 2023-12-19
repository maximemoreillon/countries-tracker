<script lang="ts">
  /*
  NOTE: this is an independent page and not a dialog so as to be able to point user to registration via URL
  */
  import Autocomplete from "@smui-extra/autocomplete"
  import Button, { Label, Icon } from "@smui/button"
  import CircularProgress from "@smui/circular-progress"
  import countries from "$lib/countries"
  import { collection, setDoc, getFirestore, doc } from "firebase/firestore"
  import { goto } from "$app/navigation"
  import { currentUser } from "$lib/firebase"

  const countryNames = countries.map((c) => c.Country)
  let country: String | undefined
  let loading = false

  const createItem = async () => {
    if (!country) return
    if (!$currentUser) return
    loading = true
    try {
      const firestore = getFirestore()

      await setDoc(
        doc(firestore, "entries", $currentUser.uid),
        {
          country,
        },
        { merge: true }
      )
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
    <Autocomplete options={countryNames} bind:value={country} label="Country" />
    <Button type="submit" variant="unelevated" disabled={loading || !country}>
      <!-- <Icon class="material-icons">check</Icon> -->
      {#if loading}
        <CircularProgress style="height: 1.5em; width: 1.5em;" indeterminate />
      {:else}
        <Label>OK</Label>
      {/if}
    </Button>
  </form>
  <a href="/">See the map</a>
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
    margin-bottom: 2.5em;
  }

  h2 {
    font-size: 200%;
  }
</style>
