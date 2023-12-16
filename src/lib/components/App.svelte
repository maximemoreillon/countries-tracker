<script lang="ts">
  import { Canvas } from "@threlte/core"
  import { T } from "@threlte/core"
  import { OrbitControls } from "@threlte/extras"
  import Earth from "./models/earth.svelte"
  import allCountries from "$lib/countries"
  import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    where,
    type Unsubscribe,
  } from "firebase/firestore"
  import { onDestroy, onMount } from "svelte"

  const deg2Rag = (x: number) => (Math.PI * x) / 180.0

  const latLon2xyz = (lat: number, lon: number) => {
    const earthRadius = 1.12
    return [
      earthRadius * Math.cos(-deg2Rag(lon)) * Math.cos(deg2Rag(lat)),
      earthRadius * Math.sin(deg2Rag(lat)),
      earthRadius * Math.sin(-deg2Rag(lon)) * Math.cos(deg2Rag(lat)),
    ]
  }

  let unsub: Unsubscribe
  const firestore = getFirestore()
  let registeredCountries: any[] = []

  const subscribeToData = () => {
    if (unsub) unsub()

    const collectionRef = collection(firestore, "entries")

    const q = query(collectionRef)

    unsub = onSnapshot(q, ({ docs }: any) => {
      registeredCountries = docs.reduce((prev: any[], doc: any) => {
        const entry = doc.data()

        const foundExistingCountry = prev.find(
          (p) => p.Country === entry.country
        )

        if (!foundExistingCountry) {
          const countryProperties = allCountries.find(
            (a) => a.Country === entry.country
          )
          prev.push({ ...countryProperties, count: 1 })
        } else {
          foundExistingCountry.count++
        }

        return prev
      }, [])
    })
  }

  onDestroy(() => {
    if (unsub) unsub()
  })

  onMount(() => subscribeToData())
</script>

<Canvas>
  <T.PerspectiveCamera makeDefault position={[10, 0, 0]} fov={15}>
    <OrbitControls
      autoRotate
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
      position={latLon2xyz(country.Latitude, country.Longitude)}
      rotation={[0, deg2Rag(country.Longitude), deg2Rag(90 + country.Latitude)]}
    >
      <!-- R, R, H, Sides -->
      <T.CylinderGeometry args={[0.02, 0.02, 0.02 * country.count, 32]} />
      <T.MeshStandardMaterial color="#F85122" />
    </T.Mesh>
  {/each}

  <!-- Earth radius is 1.1 -->
  <!-- Greenwitch is on x = 1 -->
  <Earth />
</Canvas>
