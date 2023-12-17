<script lang="ts">
  import Fab, { Icon } from "@smui/fab"
  import Dialog, { Content } from "@smui/dialog"
  import CircularProgress from "@smui/circular-progress"

  import { goto } from "$app/navigation"
  import { Canvas } from "@threlte/core"
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import Earth from "$lib/components/earth.svelte"
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

  let loading = true
  const earthRadius = 1.12
  const indicatorRadius = 0.015
  const deg2Rag = (x: number) => (Math.PI * x) / 180.0
  const spherical2cartesian = (lat: number, lon: number, radius: number) => [
    radius * Math.cos(lon) * Math.cos(lat),
    radius * Math.sin(lat),
    radius * Math.sin(lon) * Math.cos(lat),
  ]

  let unsub: Unsubscribe
  const firestore = getFirestore()
  let registeredCountries: any[] = []
  const originalCameraDistance = 15
  let cameraPosition = [originalCameraDistance, 0, 0]
  let autoRotate = true
  const queryCountry = $page.url.searchParams.get("country")

  $: maxCount = registeredCountries.reduce(
    (prev, { count }) => (count > prev ? count : prev),
    0
  )

  const getIndicatorSize = (count: number) => 0.01 * count

  const subscribeToData = () => {
    if (unsub) unsub()

    const collectionRef = collection(firestore, "entries")

    const q = query(collectionRef)

    unsub = onSnapshot(q, ({ docs }: any) => {
      if (!$currentUser) return
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

  onDestroy(() => {
    if (unsub) unsub()
  })

  onMount(() => {
    currentUser.subscribe((user) => {
      if (!user) return
      subscribeToData()
      if (queryCountry) {
        const properties = allCountries.find((a) => a.Country === queryCountry)
        if (properties) {
          cameraPosition = spherical2cartesian(
            deg2Rag(properties.Latitude),
            -deg2Rag(properties.Longitude),
            originalCameraDistance
          )

          autoRotate = false
        }
      }
    })
  })
</script>

<div>
  <Canvas>
    <!-- TODO: use query parameters to show a country -->
    <T.PerspectiveCamera makeDefault position={cameraPosition} fov={15}>
      <OrbitControls
        {autoRotate}
        enableZoom={true}
        enableDamping
        autoRotateSpeed={0.5}
        target.y={0}
      />
    </T.PerspectiveCamera>

    <T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
    <T.AmbientLight intensity={1} />

    {#each registeredCountries as country}
      <T.Mesh
        position={spherical2cartesian(
          deg2Rag(country.Latitude),
          -deg2Rag(country.Longitude),
          earthRadius + 0.5 * getIndicatorSize(country.count)
        )}
        rotation={[
          0,
          deg2Rag(country.Longitude),
          deg2Rag(90 + country.Latitude),
        ]}
      >
        <!-- R, R, H, Sides -->
        <T.CylinderGeometry
          args={[
            indicatorRadius,
            indicatorRadius,
            getIndicatorSize(country.count),
            32,
          ]}
        />
        <T.MeshStandardMaterial color="#F85122" />
      </T.Mesh>
    {/each}

    <!-- Earth radius is 1.1 -->
    <!-- Greenwitch is on x = 1 -->
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
    <Content style="text-align: center;">
      <CircularProgress style="height: 3em; width: 3em;" indeterminate />
    </Content>
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
    top: 1em;
    right: 1em;
  }
</style>
