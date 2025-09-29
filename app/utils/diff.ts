export type DiffResult = {
  updatedLines: number[];
  removedLines: number[]; // oldText indices
  addedLines: number[]; // newText indices
};

export const getDiff = (oldText: string[], newText: string[]): DiffResult => {
  const updatedLines: number[] = [];
  const removedLines: number[] = [];
  const addedLines: number[] = [];

  // Compare oldText and newText line by line
  let newIndex = 0;
  oldText.forEach((oldLine, index) => {
    if (newIndex === newText.length) {
      removedLines.push(index);
      return;
    }
    if (oldLine === newText[newIndex]) {
      newIndex++;
      return;
    }
    if (newText.at(newIndex + 1) && oldLine === newText[newIndex + 1]) {
      updatedLines.push(index);
    }
  });

  return {
    updatedLines,
    removedLines,
    addedLines,
  };
};
