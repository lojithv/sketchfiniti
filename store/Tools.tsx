import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";

export namespace ToolStateStore {
  export const [colorChange$, setColor] = createSignal<string>();

  export const [useColor, color$] = bind(colorChange$, "#ff00ff");
}
