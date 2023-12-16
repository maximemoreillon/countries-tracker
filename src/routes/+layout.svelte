<script lang="ts">
  import "$lib/firebase"
</script>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
  }
</style>
