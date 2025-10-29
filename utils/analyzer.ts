const EMPHASIS_PARTICLES = ['만', '밖에', '도', '까지', '조차', '이라도', '라도', '뿐', '이나', '나마', '부터'];

export function tokenizeKoreanText(text: string): string[] {
  const tokens: string[] = [];
  const words = text.trim().split(/\s+/);

  for (const word of words) {
    let foundParticle = false;
    for (const particle of EMPHASIS_PARTICLES) {
      if (word.endsWith(particle) && word.length > particle.length) {
        const stem = word.substring(0, word.length - particle.length);
        tokens.push(stem, particle);
        foundParticle = true;
        break;
      }
    }
    if (!foundParticle) {
      tokens.push(word);
    }
  }
  return tokens;
}

// Helper to get combinations from an array
function getCombinations<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  function backtrack(combination: T[], start: number) {
    if (combination.length === size) {
      result.push([...combination]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combination.push(arr[i]);
      backtrack(combination, i + 1);
      combination.pop();
    }
  }
  backtrack([], 0);
  return result;
}


export function generateCombinations(tokens: string[], windowSize = 5, minSize = 2): string[][] {
  const allCombinations = new Set<string>(); // Use a Set to store stringified arrays to avoid duplicates

  if (tokens.length < minSize) {
    return [];
  }
  
  const processArray = (arr: string[]) => {
      for (let size = minSize; size <= arr.length; size++) {
          const combos = getCombinations(arr, size);
          combos.forEach(combo => allCombinations.add(JSON.stringify(combo.sort())));
      }
  }
  
  if (tokens.length <= windowSize) {
      processArray(tokens);
  } else {
    // Sliding window approach
    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const window = tokens.slice(i, i + windowSize);
      processArray(window);
    }
  }

  return Array.from(allCombinations).map(s => JSON.parse(s));
}