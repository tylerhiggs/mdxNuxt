// LineChange represents a change to a line
interface LineChange {
  type: "added" | "removed" | "changed"; // "added", "removed", "changed"
  lineNum: number; // Line number in the new text (0-based)
  oldLine: number; // Line number in the old text (0-based, -1 if added)
  content: string; // The line content
  oldContent?: string; // Original content for changed lines
}

// DiffResult represents the result of a diff operation
interface DiffResult {
  changes: LineChange[];
}

/**
 * diffLines compares two strings and returns the differences
 *
 * We can assume the changes were caused by a single user edit, like
 * a key press, paste, or delete block
 */
function diffLines(previous: string, updated: string): DiffResult {
  if (previous === updated) {
    return { changes: [] };
  }

  const oldLines = previous.split("\n");
  const newLines = updated.split("\n");

  // Use a simple LCS-based approach to find differences
  const changes: LineChange[] = [];

  let newStart = 0,
    oldStart = 0,
    newEnd = newLines.length,
    oldEnd = oldLines.length; // exclusive

  while (
    newStart < newEnd &&
    oldStart < oldEnd &&
    newLines[newStart] === oldLines[oldStart]
  ) {
    newStart++;
    oldStart++;
  }

  while (
    newEnd > newStart &&
    oldEnd > oldStart &&
    newLines[newEnd - 1] === oldLines[oldEnd - 1]
  ) {
    newEnd--;
    oldEnd--;
  }

  while (newStart < newEnd || oldStart < oldEnd) {
    if (newStart === newEnd) {
      changes.push({
        type: "removed",
        lineNum: newStart,
        oldLine: oldStart,
        content: "",
      });
      oldStart++;
      continue;
    }

    if (oldStart === oldEnd) {
      changes.push({
        type: "added",
        lineNum: newStart,
        oldLine: -1,
        content: newLines[newStart] || "",
      });
      newStart++;
      continue;
    }

    changes.push({
      type: "changed",
      lineNum: newStart,
      oldLine: -1,
      content: newLines[newStart] || "",
    });
    newStart++;
    oldStart++;
  }

  return { changes };
}

export { diffLines, type LineChange, type DiffResult };
