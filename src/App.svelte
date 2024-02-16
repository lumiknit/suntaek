<script>
  import "@picocss/pico";

  import toast, { Toaster } from "svelte-french-toast";

  import Icon from "svelte-icons-pack/Icon.svelte";
  import BsTrash from "svelte-icons-pack/bs/BsTrash";
  import { rollDice } from "./lib/dice";

  let count = 1;
  let chosens = undefined;
  let choices = [""];

  const handleChooseButtonClick = () => {
    chosens = undefined;
    // Extract non-empty choices
    const nonEmptyChoices = choices
      .map((choice) => choice.trim())
      .filter(Boolean);
    if (
      nonEmptyChoices.length !== choices.length &&
      nonEmptyChoices.length > 0
    ) {
      choices = nonEmptyChoices;
    }
    if (nonEmptyChoices.length === 0) {
      toast.error("Nothing to choose!");
      return;
    }

    // Randomly choose one
    const results = [];

    for(let i = 0; i < count; i++) {
      const chosenIndex = Math.floor(Math.random() * nonEmptyChoices.length);
      let result = nonEmptyChoices[chosenIndex];
      let notes = "";

      // Check dice roll
      {
        const n = rollDice(result);
        if (n !== null) {
          notes = `dice: ${result}`;
          result = `${n}`;
        }
      }

      results.push({
        index: chosenIndex,
        result,
        notes,
      });
    }

    chosens = results;
  };

  const handleInputFocus = (idx) => {
    if (idx + 1 >= choices.length) {
      choices = [...choices, ""];
    }
  };

  const handleDeleteButtonClick = (idx) => {
    if (choices.length <= 1) {
      toast.error("At least one choice is required");
      return;
    }
    choices = choices.filter((_, i) => i !== idx);
  };
</script>

<header class="container">
  <hgroup>
    <h1>Suntaek (Random Choice)</h1>
    <p>Random Choice Utility</p>
  </hgroup>
</header>

<Toaster />

<main class="container">
  {#if chosens}
    <h4> Result </h4>
    <ol>
      {#each chosens as chosen}
        <li>
          ({1 + chosen.index})
          <b>{chosen.result}</b>
          {#if chosen.notes}
            <small>({chosen.notes})</small>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}

  <button class="line" on:click={handleChooseButtonClick}> Choose! </button>

  <h4> Count </h4>

  <input
    type="number"
    min="1"
    bind:value={count}
  />

  <h4> Choices </h4>
  {#each choices as choice, idx}
    <fieldset role="group">
      <input
        type="text"
        bind:value={choice}
        on:focus={() => handleInputFocus(idx)}
      />
      <button on:click={() => handleDeleteButtonClick(idx)}>
        <Icon src={BsTrash} />
      </button>
    </fieldset>
  {/each}

  <h4>Tips</h4>
  <ul>
    <li>Click last item to add more choices!</li>
    <li>
      It supports dice notations!
      <ul>
        <li>
          You can use common number & operators (<code>+-*/</code>) with dice
          notation <code>(count) d (sides)</code>
        </li>
        <li>
          e.g. roll a 6-sided dice: <code>d6</code>
        </li>
        <li>
          e.g. roll four 4-sided dice and add 2: <code>4d4 + 2</code>
        </li>
      </ul>
    </li>
  </ul>

  <a
    href="#"
    on:click={(e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}>Go to top</a
  >
</main>

<style>
  .line {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
