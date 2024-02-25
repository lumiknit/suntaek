<script>
  import "@picocss/pico";

  import toast, { Toaster } from "svelte-french-toast";

  import Icon from "svelte-icons-pack/Icon.svelte";
  import BsTrash from "svelte-icons-pack/bs/BsTrash";
  import BsPlusSquareFill from "svelte-icons-pack/bs/BsPlusSquareFill";
  import { rollDice } from "./lib/dice";

  import i18n from "./lang";

  let allowDuplicates = true;
  let count = 1;
  let chosens = undefined;
  let choices = [""];

  const handleChooseButtonClick = () => {
    chosens = undefined;
    // Extract non-empty choices
    const nonEmptyChoices = choices
      .map((choice, idx) => [choice.trim(), idx])
      .filter((x) => x[0].length > 0);

    if (nonEmptyChoices.length === 0) {
      toast.error($i18n.t("toast.error_no_items_to_choose"));
      return;
    }

    // Randomly choose one
    const results = [];

<<<<<<< HEAD
    for (let i = 0; i < count; i++) {
      if (nonEmptyChoices.length === 0) {
        toast($i18n.t("toast.error_no_items_more"));
||||||| 26729a1
    for(let i = 0; i < count; i++) {
      if(nonEmptyChoices.length === 0) {
        toast("No more choices to choose!");
=======
    for (let i = 0; i < count; i++) {
      if (nonEmptyChoices.length === 0) {
        toast("No more choices to choose!");
>>>>>>> main
        break;
      }

      const chosenIndex = Math.floor(Math.random() * nonEmptyChoices.length);
      const chosenItem = nonEmptyChoices[chosenIndex];
      let result = chosenItem[0];
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
        index: chosenItem[1],
        result,
        notes,
      });

      if (!allowDuplicates) {
        nonEmptyChoices.splice(chosenIndex, 1);
      }
    }

    chosens = results;
    toast.success($i18n.t("toast.success_chosen"));
  };

  const addInputField = () => {
    choices = [...choices, ""];
  };

  const handleKeyDown = (e, idx) => {
    if (e.keyCode === 13) {
      addInputField(idx + 1);
    }
  };

  const handleDeleteButtonClick = (idx) => {
    if (choices.length <= 1) {
      toast.error($i18n.t("toast.error_delete_last_item"));
      return;
    }
    choices = choices.filter((_, i) => i !== idx);
  };
</script>

<header class="container">
  <hgroup>
    <h1>{$i18n.t('title.main')}</h1>
    <p>{$i18n.t('title.sub')}</p>
  </hgroup>
</header>
<<<<<<< HEAD

<Toaster position="bottom-center" />
||||||| 26729a1

<Toaster
  position="bottom-center"
/>
=======
<Toaster position="bottom-center" />
>>>>>>> main

<main class="container">
  {#if chosens}
<<<<<<< HEAD
    <h4>{$i18n.t('result.title')}</h4>
||||||| 26729a1
    <h4> Result </h4>
=======
    <h4>Result</h4>
>>>>>>> main
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

  <button class="line" on:click={handleChooseButtonClick}> {$i18n.t('clickable.btn.main_choose')} </button>

  <details>
    <summary class="outline secondary">{$i18n.t('options.title')}</summary>

    <label>
      <input type="checkbox" bind:checked={allowDuplicates} />
      {$i18n.t('options.label.allow_duplicates')}
    </label>

<<<<<<< HEAD
    <h6>{$i18n.t('options.label.count')}</h6>
    <input type="number" min="1" bind:value={count} />
||||||| 26729a1
    <h6> Count </h6>
    <input
      type="number"
      min="1"
      bind:value={count}
    />
=======
    <h6>Count</h6>
    <input type="number" min="1" bind:value={count} />
>>>>>>> main
  </details>

  <hr />

<<<<<<< HEAD
  <h4>{$i18n.t('output.title', {count: choices.length})}</h4>
||||||| 26729a1
  <h4> Choices ({choices.length}) </h4>
=======
  <h4>Choices ({choices.length})</h4>
>>>>>>> main
  {#each choices as choice, idx}
    <fieldset role="group">
      <input
        type="text"
        bind:value={choice}
        on:keydown={(e) => handleKeyDown(e, idx)}
        autofocus
      />
      <button on:click={() => handleDeleteButtonClick(idx)}>
        <Icon src={BsTrash} />
      </button>
    </fieldset>
  {/each}
<<<<<<< HEAD

  <h4>{$i18n.t('tips.title')}</h4>
||||||| 26729a1

  <h4>Tips</h4>
=======
  <fieldset role="group">
    <button on:click={addInputField} autofocus>
      <Icon src={BsPlusSquareFill} />
    </button>
  </fieldset>
  <h4>Tips</h4>
>>>>>>> main
  <ul>
    <li>{$i18n.t('tips.1')}</li>
    <li>
      {$i18n.t('tips.2')}
      <ul>
        <li>
          {$i18n.t('tips.2_1', {
            operators: "+-*/",
            notation: "NdM",
          })}
        </li>
        <li>
          {$i18n.t('tips.2_eg1')}: <code>d6</code>
        </li>
        <li>
          {$i18n.t('tips.2_eg2')}: <code>4d4 + 2</code>
        </li>
      </ul>
    </li>
  </ul>

  <a
    href="#"
    on:click={(e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}>{$i18n.t('clickable.label.go_to_top')}</a
  >
</main>

<style>
  .line {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
