<script lang="ts">
  import { BehaviorSubject, fromEvent, debounce, interval, merge, throttle, distinctUntilChanged } from 'rxjs';

  import { assignStyles } from "$lib/dom/utils";
  import { SlicesRenderScene } from "$lib/three/slices/SlicesRenderScene";
  import GrainOverlay from "$lib/components/atmosphere/GrainOverlay.svelte";
  import GridBackground from "$lib/components/atmosphere/GridBackground.svelte";

  let renderScene: SlicesRenderScene;
  let sceneDomElement: HTMLElement;
  let uiVisible: boolean = true;

  const imageStyles = {
    objectFit: 'cover',
    opacity: '0.7',
    border: '3px solid #ff000033',
    boxSizing: 'border-box',
    filter: `saturate(${Math.floor(500 * Math.random() + 100)}%)`,
    imageRendering: 'crisp-edges'
  }

  const rows = 3;
  const images: HTMLImageElement[] = Array<HTMLImageElement>( 2 * rows );

  const focus = new BehaviorSubject<
    ( { img: HTMLImageElement, index: number }) 
    | null
  >( null );

  focus.subscribe(value => {
    if( !value ) return;
    images[value.index].src = value.img.src;
    assignStyles(
      images[value.index],
      imageStyles
    )
  })

  const buildScene = ( domElement : HTMLElement ) => {
    sceneDomElement = domElement;
    if(renderScene) renderScene.stop();

    let c = domElement.lastElementChild;
    while(c) {
      domElement.removeChild(c);
      c = domElement.lastElementChild;
    }

    renderScene = new SlicesRenderScene( 
      domElement,
      imageStyles,
      ( img ) => {
        if(!img) return;

        let index: number;
        let newImage: HTMLImageElement;
        const current = focus.getValue();

        if(!current) {
          index = 0;
          newImage = img;
        } else if(current.img.src === img.src) {
          return;
        } else {
          index = (current.index + 1) % (rows * 2);
          newImage = img;
        }

        focus.next({
          img: newImage,
          index
        })
      }
    );

    renderScene.start();

    // Events
    const resizeHandler = () => {
      renderScene.resize( window.innerWidth, window.innerHeight );
    }

    resizeHandler();

    fromEvent(window, 'resize').pipe(
      debounce(() => interval(30))
    ).subscribe(
      () => resizeHandler()
    );

    const onMouseMove$ = fromEvent(window, 'mousemove');

    const delay = 1750;
    onMouseMove$.pipe(
      throttle(() => interval(delay))
    ).subscribe(
      () => { uiVisible = true }
    );
    onMouseMove$.pipe(
      debounce(() => interval(delay))
    ).subscribe(
      () => { uiVisible = false }
    );
  }
</script>

<svelte:head>
  <title>Slices ~ by palmdrop</title>
  <meta name="description" content="Vivid interfaces - a series of fragments/slices. By palmdrop." />
  <html lang="en" />
</svelte:head>

<!-- Overlay -->
<GrainOverlay />

<!-- Interface -->
<div class="interface" class:visible={uiVisible}>
  <div class="column">
    { #each { length: rows } as _, r }
      <div class="cell">
        <img 
          bind:this={images[r]}
          alt=""
        />
      </div>
    { /each }
  </div>
  <div class="ui">
    <header>
      <h1>SLICES</h1>
      <p>
        Vivid interfaces - viewing fragments
      </p>
      <p>by 
        <a href="https://palmdrop.site" target="_blank" rel="noreferrer">palmdrop</a> 
      </p>
    </header>
    <button on:click="{() => buildScene(sceneDomElement)}">
      OTHER SLICES
    </button>
  </div>
  <div class="column">
    { #each { length: rows } as _, r }
      <div class="cell">
        <img 
          bind:this={images[rows + r]}
          alt=""
        />
      </div>
    { /each }
  </div>
</div>

<!-- Scene -->
<div 
  use:buildScene
  class='space'
/>

<!-- Background -->
<GridBackground />

<style>
  * {
    cursor: url("/svg/cursor.svg") 16 16, auto;
  }

  .interface {
    position: fixed;
    pointer-events: all;
    width: 100vw;
    height: 100vh;
    inset: 0;

    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    z-index: 100;
    pointer-events: none;

    font-family: 'Samba';
    transition: 0.3s opacity;
    opacity: 0;
  }

  .interface img {
    width: 100%;
    height: 100%;

    object-fit: cover;
    pointer-events: auto;
    opacity: 0 ;
  }

  .interface .column {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 33%;
  }

  .interface .cell {
    width: 100%;
    height: 33vh;
    box-sizing: border-box;

    flex-grow: 1;

    margin: 2px 0px;
    padding: 1em;

    border: 1px solid rgba(128, 128, 128, 0.226);
  }

  .interface .ui {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 33%;
    height: 100%;
    transition: 0.3s;
  }

  .visible {
    opacity: 1;
    transition: 0.3s;
  }

  .interface header {
    border: 1px solid rgba(128, 128, 128, 0.226);
    margin-top: 10px;

    pointer-events: auto;
  }

  .interface p {
    color: rgba(128, 128, 128, 0.5);
    padding: 0.3em;
    padding-bottom: 0.5em;
    text-align: center;
    font-size: 1.2rem;
  }

  a, a:visited {
    transition: 0.2s;
    color: rgba(128, 128, 128, 0.5);
  }

  a:hover {
    color: rgba(128, 28, 28, 0.8)
  }

  .interface h1 {
    text-align: center;
    padding-top: 0.3em;
    color: rgba(128, 128, 128, 0.5);

    font-size: calc(
      24px + 30 * ((100vw - 320px) / 680)
    );
  }

  .interface button {
    width: 100%;

    transition: 0.1s;
    color: #ff000099;
    font-size: 1.4em;

    border-radius: 0px;
    background: none;
    border: 1px solid rgba(128, 128, 128, 0.226);

    margin: 10px 0px;
    padding: 0.3em;

    pointer-events: auto;
    font-family: 'Samba';
  }

  .interface button:hover {
    color: #ff0000bb;
    background-color: rgba(0, 0, 0, 0.157);
    border: 1px solid rgba(128, 28, 28, 0.8);
  }

  .space {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000000;

    z-index: 0;

    margin: 0em;
  }
</style>