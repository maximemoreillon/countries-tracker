<script lang="ts">
  import Fab, { Icon } from "@smui/fab"
  import Dialog, { Content, Actions } from "@smui/dialog"
  import CircularProgress from "@smui/circular-progress"

  import { goto } from "$app/navigation"
  import { Canvas } from "@threlte/core"
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import Earth from "$lib/components/earth.svelte"
  import Marker from "$lib/components/marker.svelte"
  import allCountries from "$lib/countries"
  import { page } from "$app/stores"
  import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    type Unsubscribe,
  } from "firebase/firestore"
  import { onDestroy, onMount } from "svelte"
  import { currentUser } from "$lib/firebase"
  import { deg2Rag, spherical2cartesian } from "$lib/geography"

  const originalCameraDistance = 15

  let unsub: Unsubscribe
  let registeredCountries: any[] = []
  let cameraPosition = [originalCameraDistance, 0, 0]
  let loading = true
  let autoRotate = true

  const firestore = getFirestore()

  $: maxCount = registeredCountries.reduce(
    (prev, { count }) => (count > prev ? count : prev),
    0
  )

  const subscribeToData = () => {
    if (unsub) unsub()
    if (!$currentUser) return

    const collectionRef = collection(firestore, "entries")
    const q = query(collectionRef)

    unsub = onSnapshot(q, ({ docs }: any) => {
      registeredCountries = docs.reduce((prev: any[], doc: any) => {
        const entry = doc.data()
        const found = prev.find((p) => p.Country === entry.country)

        if (!found) {
          const properties = allCountries.find(
            (a) => a.Country === entry.country
          )
          prev.push({ ...properties, count: 1 })
        } else {
          found.count++
        }
        return prev
      }, [])
      loading = false
    })
  }

  const pointCameraToCountry = (countryName: string) => {
    const properties = allCountries.find((a) => a.Country === countryName)
    if (!properties) return

    cameraPosition = spherical2cartesian(
      deg2Rag(properties.Latitude),
      -deg2Rag(properties.Longitude),
      originalCameraDistance
    )

    autoRotate = false
  }

  onMount(() => {
    currentUser.subscribe((user) => {
      if (!user) return
      subscribeToData()
      const queryCountry = $page.url.searchParams.get("country")
      if (queryCountry) pointCameraToCountry(queryCountry)
    })
  })

  onDestroy(() => {
    if (unsub) unsub()
  })
</script>

<div>
  <Canvas>
    <T.PerspectiveCamera makeDefault position={cameraPosition} fov={15}>
      <OrbitControls
        {autoRotate}
        enableZoom={true}
        enableDamping
        enablePan={false}
        autoRotateSpeed={0.5}
        target.y={0}
      />
    </T.PerspectiveCamera>

    <T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
    <T.AmbientLight intensity={1} />

    {#each registeredCountries as country (country.Country)}
      <Marker {country} />
    {/each}

    <Earth />
  </Canvas>
  <Fab
    color="primary"
    class="register_button"
    on:click={() => {
      goto("/register")
    }}
  >
    <Icon class="material-icons">add</Icon>
  </Fab>
  <Dialog bind:open={loading} scrimClickAction="" escapeKeyAction="">
    <Content style="display: flex; justify-content: center; padding: 2em;">
      <CircularProgress style="height: 3em; width: 3em; " indeterminate />
    </Content>
    <!-- Dummy button to deal with focusTrap errors -->
    <button style="opacity: 0; position: absolute" />
  </Dialog>
</div>

<style>
  div {
    width: 100vw;
    height: 100vh;
    background: rgb(13, 19, 32);
    background: linear-gradient(
      180deg,
      rgba(13, 19, 32, 1) 0%,
      rgba(8, 12, 21, 1) 100%
    );
  }

  :global(.register_button) {
    position: fixed;
    top: 2em;
    right: 2em;
  }
</style>
