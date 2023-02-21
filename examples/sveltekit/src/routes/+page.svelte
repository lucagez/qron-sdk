<script lang="ts">
  export let form: any;
</script>

<main style="font-family: monospace;">
  <h1>Schedule Greetings</h1>
  <form action="?/hello" method="post">
    <div>
      <input type="text" name="name" placeholder="Who?" />
      {#if form?.errors?.name}
        <p style="color: tomato;">{form.errors.name}</p>
      {/if}
    </div>
    <button type="submit">Say Hi 👋</button>
  </form>
</main>