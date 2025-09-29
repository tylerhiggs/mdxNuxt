//go:build js && wasm
// +build js,wasm

package main

import (
	"encoding/json"
	"syscall/js"
)

// diffLinesWrapper is the JavaScript-callable wrapper
func diffLinesWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) != 2 {
		return map[string]interface{}{
			"error": "Expected 2 arguments: previous and new strings",
		}
	}

	previous := args[0].String()
	updated := args[1].String()

	result := diffLines(previous, updated)

	// Convert to JSON for JavaScript
	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return map[string]interface{}{
			"error": "Failed to marshal result: " + err.Error(),
		}
	}

	return string(jsonBytes)
}

func main() {
	// Register the function to be callable from JavaScript
	js.Global().Set("diffLines", js.FuncOf(diffLinesWrapper))

	// Keep the program running
	select {}
}
