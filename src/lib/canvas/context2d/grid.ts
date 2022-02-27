import { clearRect } from "./utils";

export type DynamicGridRenderProperty 
  = ((canvasWidth: number, canvasHeight: number) => number) 
  | number;

export type GridRenderSettings = {
  area?: {
    x: DynamicGridRenderProperty,
    y: DynamicGridRenderProperty,
    width: DynamicGridRenderProperty,
    height: DynamicGridRenderProperty
  },

  rows: DynamicGridRenderProperty,
  columns: DynamicGridRenderProperty,

  lineWidth?: DynamicGridRenderProperty,
  lineColor?: string
  backgroundColor?: string 
}

const evaluateDynamicProperty = (property: DynamicGridRenderProperty, context: CanvasRenderingContext2D) => {
  if(typeof property === 'number') return property;

  const canvasWidth = context.canvas.clientWidth;
  const canvasHeight = context.canvas.clientHeight;

  return property(canvasWidth, canvasHeight);
}

export const renderGrid = (
  context: CanvasRenderingContext2D, 
  settings: GridRenderSettings
) => {
  const canvasWidth = context.canvas.width;
  const canvasHeight = context.canvas.height;

  const area = settings.area ? {
    x: evaluateDynamicProperty(settings.area.x, context),
    y: evaluateDynamicProperty(settings.area.y, context),
    width: evaluateDynamicProperty(settings.area.width, context),
    height: evaluateDynamicProperty(settings.area.height, context),
  } : {
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight
  }

  const rows = Math.floor(evaluateDynamicProperty(settings.rows, context));
  const columns = Math.floor(evaluateDynamicProperty(settings.columns, context));

  const lineWidth = settings.lineWidth 
    ? evaluateDynamicProperty(settings.lineWidth, context) 
    : 1;

  const lineColor = settings.lineColor || '#ffffff';
  const backgroundColor = settings.backgroundColor;

  // 

  if(backgroundColor) {
    clearRect(
      context,
      backgroundColor,
      area
    );
  }

  context.lineWidth = lineWidth;
  context.strokeStyle = lineColor;

  for(let x = 0; x < columns; x++) {
    context.beginPath();
    context.moveTo(
      area.x + x * area.width / columns,
      area.y
    );

    context.lineTo(
      area.x + x * area.width / columns,
      area.y + area.height
    );

    context.stroke();
  }

  for(let y = 0; y < rows; y++) {
    context.beginPath();
    context.moveTo(
      area.x,
      area.y + y * area.height / rows,
    );

    context.lineTo(
      area.x + area.width,
      area.y + y * area.height / rows,
    );

    context.stroke();
  }
}