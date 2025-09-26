package main

import (
	"reflect"
	"testing"
)

func TestDiffLines(t *testing.T) {
	tests := []struct {
		name     string
		previous string
		updated  string
		expected DiffResult
	}{
		{
			name:     "identical strings",
			previous: "line1\nline2\nline3",
			updated:  "line1\nline2\nline3",
			expected: DiffResult{Changes: []LineChange{}},
		},
		{
			name:     "empty strings",
			previous: "",
			updated:  "",
			expected: DiffResult{Changes: []LineChange{}},
		},
		{
			name:     "add single line to empty",
			previous: "",
			updated:  "new line",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "changed", LineNum: 0, OldLine: -1, Content: "new line"},
				},
			},
		},
		{
			name:     "remove single line",
			previous: "line to remove",
			updated:  "",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "changed", LineNum: 0, OldLine: -1, Content: ""},
				},
			},
		},
		{
			name:     "add line at beginning",
			previous: "line2\nline3",
			updated:  "line1\nline2\nline3",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "added", LineNum: 0, OldLine: -1, Content: "line1"},
				},
			},
		},
		{
			name:     "add line in middle",
			previous: "line1\nline3\n",
			updated:  "line1\n\nline3\n",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "added", LineNum: 1, OldLine: -1, Content: ""},
				},
			},
		},
		{
			name:    "add line at end",
			previous: "line1\nline2",
			updated:  "line1\nline2\nline3",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "added", LineNum: 2, OldLine: -1, Content: "line3"},
				},
			},
		},
		{
			name:    "remove line from beginning",
			previous: "line1\nline2\nline3",
			updated:  "line2\nline3",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "removed", LineNum: 0, OldLine: 0},
				},
			},
		},
		{
			name:    "remove line from middle",
			previous: "line1\nline2\nline3",
			updated:  "line1\nline3",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "removed", LineNum: 1, OldLine: 1},
				},
			},
		},
		{
			name:     "change single line",
			previous: "old line",
			updated:  "new line",
			expected: DiffResult{
				Changes: []LineChange{
					{Type: "changed", LineNum: 0, OldLine: -1, Content: "new line"},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := diffLines(tt.previous, tt.updated)
			if !equalDiffResults(result, tt.expected) {
				t.Errorf("diffLines() = \n\t%+v, want\n\t%+v", result, tt.expected)
			}
		})
	}
}

// Helper function to compare DiffResults
func equalDiffResults(a, b DiffResult) bool {
	if len(a.Changes) != len(b.Changes) {
		return false
	}

	for i := range a.Changes {
		if !reflect.DeepEqual(a.Changes[i], b.Changes[i]) {
			return false
		}
	}

	return true
}

func BenchmarkDiffLinesSmall(b *testing.B) {
	previous := "line1\nline2\nline3"
	updated := "line1\nmodified line2\nline3\nline4"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		diffLines(previous, updated)
	}
}
