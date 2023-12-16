<script lang="ts">
  import "$lib/firebase"
  import { getAuth, signInAnonymously } from "firebase/auth"

  const auth = getAuth()
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      // const errorCode = error.code
      // const errorMessage = error.message
      console.error(error)
    })
</script>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
  }
</style>
