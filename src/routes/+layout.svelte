<script lang="ts">
  import "$lib/firebase"
  import { getAuth, signInAnonymously } from "firebase/auth"
  import { Icon } from "@smui/button"

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
  <footer>
    <a href="https://github.com/maximemoreillon/countries-tracker">
      Countries tracker - Maxime Moreillon
    </a>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5em;
    display: flex;
    justify-content: center;
  }

  footer a {
    color: white;
    text-decoration: none;
  }
</style>
