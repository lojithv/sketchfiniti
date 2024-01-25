import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";

export namespace ToolStateStore {
  export const [brushStrokeColorChange$, setBrushStrokeColor] = createSignal<string>();

  export const [useBrushStrokeColor, brushStrokeColor$] = bind(brushStrokeColorChange$, "#ff00ff");

  export const [canvasBgColorChange$, setCanvasBgColor] = createSignal<string>();

  export const [useCanvasBgColor, canvasBgColor$] = bind(canvasBgColorChange$, "#ff00ff");
}
