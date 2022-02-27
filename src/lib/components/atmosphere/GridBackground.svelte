<script lang="ts">
  import { renderGrid } from "$lib/canvas/context2d/grid";
  import Canvas2DRenderer from "../canvas/Canvas2DRenderer.svelte";
  
  const renderBackground = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    renderGrid(
      context,
      {
        rows: (w, h) => h / 20,
        columns: (w, h) => w / 10,
        lineColor: '#202020',
        lineWidth: 0.4,
      }
    );
    renderGrid(
      context,
      {
        rows: (w, h) => h / 100,
        columns: (w, h) => w / 100,
        lineColor: '#202020',
        lineWidth: 0.4,
      }
    );
    renderGrid(
      context,
      {
        rows: (w, h) => h / 300,
        columns: (w, h) => w / 300,
        lineColor: '#202020',
        lineWidth: 0.4,
      }
    );
  }

</script>

<div class="background" />
<Canvas2DRenderer
  onMount={renderBackground}
  onResize={renderBackground}
  style={`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  `}
/>

<style>
  .background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    z-index: -2;
    background: radial-gradient(#0c0c0c, #120c0c);
  }
</style>