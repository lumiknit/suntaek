<script>
  import "@picocss/pico";

  import toast, { Toaster } from "svelte-french-toast";

  import Icon from "svelte-icons-pack/Icon.svelte";
  import BsGithub from "svelte-icons-pack/bs/BsGithub";
  import BsTrash from "svelte-icons-pack/bs/BsTrash";
  import BsPlusSquare from "svelte-icons-pack/bs/BsPlusSquare";
  import BsDice3 from "svelte-icons-pack/bs/BsDice3";
  import HiSolidSparkles from "svelte-icons-pack/hi/HiSolidSparkles";
  import { rollDice } from "./lib/dice";

  import i18n from "./lang";
  import LLMView from "./LLMView.svelte";

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

    for (let i = 0; i < count; i++) {
      if (nonEmptyChoices.length === 0) {
        toast($i18n.t("toast.error_no_items_more"));
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const addInputField = () => {
    choices = [...choices, ""];
    setTimeout(() => {
      const inputs = document.querySelectorAll("input[type=text].choice-input");
      const lastInput = inputs[inputs.length - 1];
      lastInput.focus();
    }, 10);
  };

  const handleKeyDown = (e, idx) => {
    if (e.keyCode === 13) {
      addInputField(idx + 1);
    }
  };

  const handleDeleteButtonClick = (idx) => {
    if (choices.length <= 1) {
      // In this case, reset whole list
      choices = [""];
      return;
    } else {
      choices = choices.filter((_, i) => i !== idx);
    }
  };

  const handleClearButtonClick = () => {
    if (confirm($i18n.t("confirm.clear"))) {
      choices = [""];
    }
  };

  const handleLLMResult = (lines) => {
    choices = lines;
  };
</script>

<header class="container">
  <hgroup>
    <div>
      <h1>{$i18n.t("title.main")}</h1>
      <p>{$i18n.t("title.sub")}</p>
    </div>
    <div class="github">
      <a href="https://github.com/lumiknit/suntaek" target="_blank">
        <Icon src={BsGithub} />
      </a>
    </div>
  </hgroup>
</header>
<Toaster
  position="top-center"
  toastOptions={{
    className: "toast-item",
  }}
/>

<div class="btn-choose-wrap">
  <button class="btn-choose" on:click={handleChooseButtonClick}>
    <Icon src={BsDice3} />
    {$i18n.t("clickable.btn.main_choose")}
  </button>
</div>

<main class="container">
  {#if chosens}
    <h4>{$i18n.t("result.title")}</h4>
    <ol>
      {#each chosens as chosen}
        <li class="chosen">
          <div class="index">#{1 + chosen.index}</div>
          <b>{chosen.result}</b>
          {#if chosen.notes}
            <small>({chosen.notes})</small>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}

  <details>
    <summary class="outline secondary">{$i18n.t("options.title")}</summary>

    <label>
      <input type="checkbox" bind:checked={allowDuplicates} />
      {$i18n.t("options.label.allow_duplicates")}
    </label>

    <h6>{$i18n.t("options.label.count")}</h6>
    <input type="number" min="1" bind:value={count} />
  </details>

  <hr />

  <h4>
    {$i18n.t("output.title", { count: choices.filter((x) => x).length })}
    <button class="secondary" on:click={handleClearButtonClick}>
      <Icon src={BsTrash} />
    </button>
  </h4>
  {#each choices as choice, idx}
    <fieldset role="group">
      <input
        class="choice-input"
        type="text"
        bind:value={choice}
        on:keydown={(e) => handleKeyDown(e, idx)}
      />
      <button
        class="secondary btn-delete"
        on:click={() => handleDeleteButtonClick(idx)}
      >
        <Icon src={BsTrash} />
      </button>
    </fieldset>
  {/each}
  <fieldset role="group">
    <button class="outline secondary" on:click={addInputField} autofocus>
      <Icon src={BsPlusSquare} />
    </button>
  </fieldset>
  <details>
    <summary> <Icon src={HiSolidSparkles} /> AI</summary>
    <p class="box">
      <LLMView onLLMResult={handleLLMResult} />
    </p>
  </details>

  <h4>{$i18n.t("tips.title")}</h4>
  <ul>
    <li>
      {$i18n.t("tips.2")}
      <ul>
        <li>
          {$i18n.t("tips.2_1", {
            operators: "+-*/",
            notation: "NdM",
          })}
        </li>
        <li>
          {$i18n.t("tips.2_eg1")}: <code>d6</code>
        </li>
        <li>
          {$i18n.t("tips.2_eg2")}: <code>4d4 + 2</code>
        </li>
      </ul>
    </li>
  </ul>

  <!-- svelte-ignore a11y_invalid_attribute -->
  <a
    href="#"
    on:click={(e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}>{$i18n.t("clickable.label.go_to_top")}</a
  >
</main>

<style>
  hgroup {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > div {
      line-height: 0;
    }
  }

  .github a {
    font-size: 2rem;
  }

  li.chosen {
    position: relative;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    background-color: #8882;
    border-radius: 1rem;

    & div.index {
      position: absolute;
      top: 0.5rem;
      right: 1rem;
      z-index: -1;

      font-size: 1rem;
      color: #8888;
    }

    & small {
      font-size: 0.75em;
      color: #888d;
    }
  }

  .btn-delete {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn-choose-wrap {
    position: fixed;
    z-index: 10;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }

  .btn-choose {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem auto;
    border-radius: 999rem;
    box-shadow: 0 0.125rem 0.5rem #0004;
  }

  @media (prefers-color-scheme: dark) {
    :global(.toast-item) {
      background-color: #333 !important;
      color: #eee !important;
    }
  }

  @media (prefers-color-scheme: light) {
    :global(.toast-item) {
      background-color: #fff !important;
      color: #333 !important;
    }
  }

  button {
    touch-action: manipulation;
  }

  summary {
    text-align: center;
  }

  .box {
    padding: 1rem;
    background-color: #8881;
    border-radius: 1rem;
  }
</style>
