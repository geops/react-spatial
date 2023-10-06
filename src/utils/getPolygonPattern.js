import { DEVICE_PIXEL_RATIO } from "ol/has";

const getPolygonPattern = (patternId = 1, color = [235, 0, 0, 1]) => {
  if (patternId === 1) {
    return color;
  }

  const canvasElement = document.createElement("canvas");
  const pixelRatio = DEVICE_PIXEL_RATIO;

  canvasElement.width = 20 * pixelRatio;
  canvasElement.height = 20 * pixelRatio;

  let pattern = {};
  const ctx = canvasElement.getContext("2d");
  ctx.strokeStyle = `rgba(${color.toString()})`;
  ctx.fillStyle = `rgba(${color.toString()})`;
  ctx.lineWidth = 3;

  switch (patternId) {
    case 2:
      /* Hatched pattern */
      /* Ascending line */
      ctx.beginPath();
      ctx.moveTo(0, canvasElement.height);
      ctx.lineTo(0, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, 0);
      ctx.lineTo(canvasElement.width, 0);
      ctx.lineTo(canvasElement.width, ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, canvasElement.height);
      ctx.lineTo(ctx.lineWidth / 2, canvasElement.height);
      ctx.fill();
      ctx.closePath();

      /* Descending line */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, canvasElement.height);
      ctx.lineTo(canvasElement.width, canvasElement.height);
      ctx.lineTo(canvasElement.width, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.closePath();

      pattern = ctx.createPattern(canvasElement, "repeat");
      pattern.canvas = canvasElement;
      break;
    case 3:
      /* Shade ascending pattern */
      /* Corner triangle */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, 0);
      ctx.fill();
      ctx.closePath();

      /* Ascending line */
      ctx.beginPath();
      ctx.moveTo(0, canvasElement.height);
      ctx.lineTo(0, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, 0);
      ctx.lineTo(canvasElement.width, 0);
      ctx.lineTo(canvasElement.width, ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, canvasElement.height);
      ctx.lineTo(ctx.lineWidth / 2, canvasElement.height);
      ctx.fill();
      ctx.closePath();

      /* Corner triangle */
      ctx.beginPath();
      ctx.moveTo(canvasElement.width, canvasElement.height);
      ctx.lineTo(canvasElement.width, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, canvasElement.height);
      ctx.fill();
      ctx.closePath();

      pattern = ctx.createPattern(canvasElement, "repeat");
      pattern.canvas = canvasElement;
      break;
    case 4:
      /* Shade descending pattern */
      /* Corner triangle */
      ctx.beginPath();
      ctx.moveTo(canvasElement.width, 0);
      ctx.lineTo(canvasElement.width, ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, 0);
      ctx.fill();
      ctx.closePath();

      /* Descending line */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, ctx.lineWidth / 2);
      ctx.lineTo(canvasElement.width - ctx.lineWidth / 2, canvasElement.height);
      ctx.lineTo(canvasElement.width, canvasElement.height);
      ctx.lineTo(canvasElement.width, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.closePath();

      /* Corner triangle */
      ctx.beginPath();
      ctx.moveTo(0, canvasElement.height);
      ctx.lineTo(0, canvasElement.height - ctx.lineWidth / 2);
      ctx.lineTo(ctx.lineWidth / 2, canvasElement.height);
      ctx.fill();
      ctx.closePath();

      pattern = ctx.createPattern(canvasElement, "repeat");
      pattern.canvas = canvasElement;
      break;
    default:
  }

  if (patternId === 0) {
    pattern.empty = true;
  }

  pattern.id = patternId;
  pattern.color = color;

  return pattern;
};

export default getPolygonPattern;
