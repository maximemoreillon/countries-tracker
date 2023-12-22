<script lang="ts">
  import { T } from "@threlte/core"
  import { Texture, SpriteMaterial } from "three"
  import { deg2Rag, spherical2cartesian } from "$lib/geography"

  type Country = {
    count: number
    Latitude: number
    Longitude: number
    Country: string
  }
  export let country: Country

  const earthRadius = 1.12
  const indicatorRadius = 0.015

  const getIndicatorSize = (count: number) => 0.01 * count

  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 600
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  const fontSize = 20
  const text = `${country.Country}: ${country.count}`
  const x = 0.5 * canvas.width
  const y = 0.5 * canvas.height
  ctx.font = `${fontSize}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.strokeText(text, x, y)
  ctx.fillStyle = "#ff0000"
  ctx.fillText(text, x, y)

  const texture = new Texture(canvas)
  texture.needsUpdate = true
  const spriteMaterial = new SpriteMaterial({ map: texture })
</script>

<T.Mesh
  position={spherical2cartesian(
    deg2Rag(country.Latitude),
    -deg2Rag(country.Longitude),
    earthRadius + 0.5 * getIndicatorSize(country.count)
  )}
  rotation={[0, deg2Rag(country.Longitude), deg2Rag(90 + country.Latitude)]}
>
  <T.CylinderGeometry
    args={[
      indicatorRadius,
      indicatorRadius,
      getIndicatorSize(country.count),
      32,
    ]}
  />
  <T.MeshStandardMaterial color="#ff0000" />
</T.Mesh>

<!-- <T.PointLight
  intensity={0.1 * country.count}
  color="#ff0000"
  position={spherical2cartesian(
    deg2Rag(country.Latitude),
    -deg2Rag(country.Longitude),
    earthRadius + 0.01
  )}
/> -->

<T.Sprite
  args={[spriteMaterial]}
  position={spherical2cartesian(
    deg2Rag(country.Latitude),
    -deg2Rag(country.Longitude),
    1.1 * earthRadius + 0.5 * getIndicatorSize(country.count)
  )}
></T.Sprite>
