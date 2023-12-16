<script lang="ts">
  import { Canvas } from "@threlte/core"
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import Earth from "./models/earth.svelte"
  import allCountries from "$lib/countries"
  import { page } from "$app/stores"
  import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    where,
    type Unsubscribe,
  } from "firebase/firestore"
  import { onDestroy, onMount } from "svelte"

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
  let cameraPosition = [10, 0, 0]
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
    })
  }

  onDestroy(() => {
    if (unsub) unsub()
  })

  onMount(() => {
    subscribeToData()
    if (queryCountry) {
      const properties = allCountries.find((a) => a.Country === queryCountry)
      if (properties) {
        cameraPosition = spherical2cartesian(
          deg2Rag(properties.Latitude),
          -deg2Rag(properties.Longitude),
          10
        )

        autoRotate = false
      }
    }
  })
</script>

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
      rotation={[0, deg2Rag(country.Longitude), deg2Rag(90 + country.Latitude)]}
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
