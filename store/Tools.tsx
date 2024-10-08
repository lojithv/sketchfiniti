import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { parseColor, Color } from "@react-stately/color";

export type ExportOptions = {
  // format: 'png' | 'jpeg' | 'webp' | 'svg';
  // quality: number;
  withBackground: boolean;
};

export namespace ToolStateStore {
  export const [brushStrokeColorChange$, setBrushStrokeColor] = createSignal<Color>();

  export const [useBrushStrokeColor, brushStrokeColor$] = bind(brushStrokeColorChange$, parseColor('hsba(0, 0%, 91%, 1)'));

  export const [canvasBgColorChange$, setCanvasBgColor] = createSignal<Color>();

  export const [useCanvasBgColor, canvasBgColor$] = bind(canvasBgColorChange$, parseColor('hsba(0, 0%, 22%, 1)'));

  export const [brushStrokeWidthChange$, setBrushStrokeWidth] = createSignal<number>();

  export const [useBrushStrokeWidth, brushStrokeWidth$] = bind(brushStrokeWidthChange$, 5);

  export const [eraserStrokeWidthChange$, setEraserStrokeWidth] = createSignal<number>();

  export const [useEraserStrokeWidth, eraserStrokeWidth$] = bind(eraserStrokeWidthChange$, 80);

  export const [exportOptionsChange$, setExportOptions] = createSignal<ExportOptions>();

  export const [useExportOptions, exportOptions$] = bind(exportOptionsChange$, { withBackground: true });

  export const [stateUpdatedChange$, setStateUpdated] = createSignal<boolean>();

  export const [useStateUpdated, stateUpdated$] = bind(stateUpdatedChange$, false);
}
