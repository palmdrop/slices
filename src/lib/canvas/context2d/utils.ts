
export const clearRect = (
  context: CanvasRenderingContext2D,
  clearColor = '00000000',
  area = { 
    x: 0, 
    y: 0, width: context.canvas.width, 
    height: context.canvas.height 
  }
) => {
  const previousFillStyle = context.fillStyle;
  context.fillStyle = clearColor;
  context.fillRect(
    area.x, 
    area.y, 
    area.width, 
    area.height
  );
  context.fillStyle = previousFillStyle;
}