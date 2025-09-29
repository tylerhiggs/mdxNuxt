package main

import (
	"strings"
)

// LineChange represents a change to a line
type LineChange struct {
	Type       string `json:"type"`                 // "added", "removed", "changed"
	LineNum    int    `json:"lineNum"`              // Line number in the new text (0-based)
	OldLine    int    `json:"oldLine"`              // Line number in the old text (0-based, -1 if added)
	Content    string `json:"content"`              // The line content
	OldContent string `json:"oldContent,omitempty"` // Original content for changed lines
}

// DiffResult represents the result of a diff operation
type DiffResult struct {
	Changes []LineChange `json:"changes"`
}

/*
diffLines compares two strings and returns the differences

We can assume the changes were caused by a single user edit, like
a key press, paste, or delete block
*/
func diffLines(previous, updated string) DiffResult {
	if previous == updated {
		return DiffResult{Changes: []LineChange{}}
	}
	oldLines := strings.Split(previous, "\n")
	newLines := strings.Split(updated, "\n")

	// Use a simple LCS-based approach to find differences
	changes := []LineChange{}

	newStart, oldStart, newEnd, oldEnd := 0, 0, len(newLines), len(oldLines) // exclusive
	for newStart < newEnd && oldStart < oldEnd && newLines[newStart] == oldLines[oldStart] {
		newStart++
		oldStart++
	}
	for newEnd > newStart && oldEnd > oldStart && newLines[newEnd-1] == oldLines[oldEnd-1] {
		newEnd--
		oldEnd--
	}

	for newStart < newEnd || oldStart < oldEnd {
		if newStart == newEnd {
			changes = append(changes, LineChange{
				Type:    "removed",
				LineNum: newStart,
				OldLine: oldStart,
			})
			oldStart++
			continue
		}
		if oldStart == oldEnd {
			changes = append(changes, LineChange{
				Type:    "added",
				LineNum: newStart,
				OldLine: -1,
				Content: newLines[newStart],
			})
			newStart++
			continue
		}
		changes = append(changes, LineChange{
			Type:       "changed",
			LineNum:    newStart,
			OldLine:    -1,
			Content:    newLines[newStart],
		})
		newStart++
		oldStart++
	}

	return DiffResult{Changes: changes}
}
