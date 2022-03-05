<script lang="ts">
  import { renderGrid } from "$lib/canvas/context2d/grid";
  import * as THREE from "three";
  import Canvas2DRenderer from "../canvas/Canvas2DRenderer.svelte";

  const wd1 = THREE.MathUtils.randInt( 5, 20 );
  const hd1 = THREE.MathUtils.randInt( 5, 20 );
  
  const wd2 = THREE.MathUtils.randInt( 25, 100 );
  const hd2 = THREE.MathUtils.randInt( 25, 100 );

  const wd3 = THREE.MathUtils.randInt( 100, 300 );
  const hd3 = THREE.MathUtils.randInt( 100, 300 );

  const renderBackground = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    renderGrid(
      context,
      {
        rows: (w, h) => h / hd1,
        columns: (w, h) => w / wd1,
        lineColor: '#202020',
        lineWidth: 0.4,
      }
    );
    renderGrid(
      context,
      {
        rows: (w, h) => h / hd2,
        columns: (w, h) => w / wd2,
        lineColor: '#202020',
        lineWidth: 0.4,
      }
    );
    renderGrid(
      context,
      {
        rows: (w, h) => h / hd3,
        columns: (w, h) => w / wd3,
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