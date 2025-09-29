import { diffLines as tsDiffLines } from "../utils/diff";
export interface LineChange {
  type: "added" | "removed" | "changed";
  lineNum: number;
  oldLine: number;
  content: string;
  oldContent?: string;
}

export interface DiffResult {
  changes: LineChange[];
}

// Declare Go as a global type
declare global {
  interface Window {
    Go: new () => {
      importObject: WebAssembly.Imports;
      run: (instance: WebAssembly.Instance) => Promise<void>;
    };
    diffLines: (previous: string, updated: string) => string;
  }
}

export function useDiff() {
  let wasmModule: WebAssembly.Instance | null = null;
  let diffLines: ((previous: string, updated: string) => string) | null = null;
  let totalDiffTime = 0;
  let diffCount = 0;
  let tsTotalDiffTime = 0;
  let tsDiffCount = 0;

  const loadGoWasmScript = async (): Promise<boolean> => {
    if (import.meta.server) return false;

    // Check if Go is already loaded
    if (window.Go) return true;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "/wasm_exec.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const loadWasm = async () => {
    if (import.meta.server) return null;

    if (wasmModule) return wasmModule;

    try {
      // Load the Go WASM support script first
      const goLoaded = await loadGoWasmScript();
      if (!goLoaded) {
        throw new Error("Failed to load Go WASM support script");
      }

      const go = new window.Go();
      const wasmFile = await fetch("/diff.wasm");
      const wasmArrayBuffer = await wasmFile.arrayBuffer();
      const wasmInstance = await WebAssembly.instantiate(
        wasmArrayBuffer,
        go.importObject,
      );

      go.run(wasmInstance.instance);

      // The diffLines function is now available globally
      diffLines = window.diffLines;
      wasmModule = wasmInstance.instance;

      return wasmModule;
    } catch (error) {
      console.error("Failed to load WASM module:", error);
      return null;
    }
  };

  const diff = (previous: string, newText: string): DiffResult | null => {
    // please load the wasm module first
    if (!diffLines) {
      console.error("WASM module not loaded");
      return null;
    }

    try {
      const startTime = performance.now();
      const result = diffLines(previous, newText);
      const parsed = JSON.parse(result) as DiffResult;
      const endTime = performance.now();
      diffCount++;
      totalDiffTime += endTime - startTime;
      console.log(
        `Current averageDiffTime is ${(totalDiffTime / diffCount).toFixed(2)}ms`,
      );
      const startTimeTS = performance.now();
      const resultTS = tsDiffLines(previous, newText);
      const endTimeTS = performance.now();
      tsDiffCount++;
      tsTotalDiffTime += endTimeTS - startTimeTS;
      console.log(
        `Current tsAverageDiffTime is ${(tsTotalDiffTime / tsDiffCount).toFixed(
          2,
        )}ms`,
      );
      console.log(
        "results are equal",
        JSON.stringify(resultTS) === JSON.stringify(parsed),
      );
      return parsed;
    } catch (error) {
      console.error("Error calling diff function:", error);
      return null;
    }
  };

  return {
    diff,
    loadWasm,
  };
}
