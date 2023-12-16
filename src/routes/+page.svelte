<script lang="ts">
  import App from "$lib/components/App.svelte"
  import Fab, { Icon } from "@smui/fab"
  import { goto } from "$app/navigation"
</script>

<div>
  <App />
  <Fab
    color="primary"
    class="register_button"
    on:click={() => {
      goto("/register")
    }}
  >
    <Icon class="material-icons">add</Icon>
  </Fab>
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
