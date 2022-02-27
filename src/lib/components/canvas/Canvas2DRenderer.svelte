<script lang="ts">
  import { onDestroy } from "svelte";

  type RenderCallback = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  const nop = () => {};

  export let width: number = 1000;
  export let height: number = 1000;
  export let style: string = ''; 
  export let onMount: RenderCallback = nop;
  export let onResize: RenderCallback = nop;

  let canvasElement: HTMLCanvasElement | undefined;
  let resizeCallback: () => void;

  const useOnMount = (canvas: HTMLCanvasElement) => {
    canvasElement = canvas;

    const context = canvas.getContext('2d');

    resizeCallback = () => onResize(context, canvas);
    window.addEventListener('resize', resizeCallback);

    onMount(context, canvas);
  }

  onDestroy(() => {
    if(!canvasElement) return;

    window.removeEventListener('resize', resizeCallback);
  })
</script>

<canvas 
  use:useOnMount 
  style={style}
  width={width}
  height={height}
/>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>