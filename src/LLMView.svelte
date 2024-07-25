<script>
  import toast from "svelte-french-toast";

  import {
    runLLM,
    saveLLMConfig,
    loadLLMConfig,
    TYPES,
    LLM_INFO,
  } from "./lib/llm";
  import { onMount } from "svelte";
  import Icon from "svelte-icons-pack";
  import HiSolidSparkles from "svelte-icons-pack/hi/HiSolidSparkles";

  import i18n from "./lang";

  /**
   * @type {function(v: string[]): void}
   */
  export let onLLMResult;

  let config = undefined;

  // config destructed
  let llmType = "";
  let model = "";
  let baseURL = "";
  let apiKey = "";
  let apiKeyURL = "";

  let errorMsg = "";

  let models = [];

  let systemPrompt = `
You are a helper to list up the options which will be randomly chosen.
- You should generate a list of options based on the user's requirements.
- Each option should be separated by a new line.
- You cannot say any other words except the options.
- Each option can be just a word or a sentence, or dice notation such as (4d6 + 3).
`.trim();
  let userPrompt = "";

  const initWithType = (type) => {
    const i = LLM_INFO[type];
    baseURL = i.defaultBaseURL;
    models = i.models;
    model = i.models[0];
    apiKeyURL = i.apiKeyURL;
  };

  onMount(() => {
    const c = loadLLMConfig();
    llmType = c.type || TYPES[0];

    const i = LLM_INFO[llmType];
    baseURL = c.baseURL || i.defaultBaseURL;
    models = i.models;
    model = c.model || i.models[0];
    apiKey = c.apiKey || "";
    apiKeyURL = i.apiKeyURL;
    config = c;
  });

  const handleRunButtonClick = () => {
    const f = async () => {
      let res = "";
      try {
        res = await runLLM(config, systemPrompt, userPrompt);
      } catch (e) {
        console.log(e);
        errorMsg = e.message;
        throw e;
      }

      const lines = res
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
      onLLMResult(lines);
    };

    toast.promise(f(), {
      loading: $i18n.t("llm_view.toast.generating"),
      success: $i18n.t("llm_view.toast.generated"),
      error: $i18n.t("llm_view.toast.failed"),
    });
  };

  $: {
    if (config !== undefined && config.type !== llmType) {
      config.type = llmType;

      // Reset model
      initWithType(llmType);

      saveLLMConfig(config);
      toast.success("LLM type changed");
    }
  }

  $: {
    if (config !== undefined) {
      config.model = model;
      saveLLMConfig(config);
    }
  }

  $: {
    if (config !== undefined) {
      config.baseURL = baseURL;
      saveLLMConfig(config);
    }
  }

  $: {
    if (config !== undefined) {
      config.apiKey = apiKey;
      saveLLMConfig(config);
    }
  }
</script>

{#if config !== undefined}
  <button on:click={handleRunButtonClick}>
    <Icon src={HiSolidSparkles} />
    {$i18n.t("llm_view.label.generate")}
  </button>

  {#if errorMsg}
    <pre>{errorMsg}</pre>
  {/if}

  <label>
    {$i18n.t("llm_view.label.your_request")}
    <textarea placeholder={$i18n.t("llm_view.label.your_prompt_here")} bind:value={userPrompt} />
  </label>

  <label>
    {$i18n.t("llm_view.label.system_prompt")}
    <textarea placeholder={$i18n.t("llm_view.label.system_prompt")} bind:value={systemPrompt} />
  </label>

  <label>
    {$i18n.t("llm_view.label.llm_type")}
    <select aria-label="LLM Type" bind:value={llmType}>
      {#each TYPES as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </label>

  <label>
    {$i18n.t("llm_view.label.model")}
    <select aria-label="Model" bind:value={model}>
      {#each models as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
  </label>

  <label>
    {$i18n.t("llm_view.label.api_key")} (<a href={apiKeyURL} target="_blank">{$i18n.t("llm_view.label.get_from_here")}</a>)
    <input type="text" bind:value={apiKey} required />
  </label>

  <label>
    {$i18n.t("llm_view.label.base_url")}
    <input type="text" bind:value={baseURL} />
  </label>
{:else}
  <span>Loading config</span>
{/if}

<style>
  button {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
