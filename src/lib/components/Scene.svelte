<script lang="ts">
  import { T, useLoader } from "@threlte/core"
  import { ContactShadows, Float, Grid, OrbitControls } from "@threlte/extras"
  import Earth from "./models/earth.svelte"
</script>

<T.PerspectiveCamera makeDefault position={[-7, 7, 7]} fov={15}>
  <OrbitControls
    autoRotate
    enableZoom={true}
    enableDamping
    autoRotateSpeed={0}
    target.y={0}
  />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={1} />

<T.Mesh position={[1.1, 0, 0]}>
  <T.SphereGeometry args={[0.1]} />
  <T.MeshStandardMaterial color="#F85122" />
</T.Mesh>

<!-- Earth radius is 1.1 -->
<!-- Greenwitch is on x = 1 -->
<Earth></Earth>
