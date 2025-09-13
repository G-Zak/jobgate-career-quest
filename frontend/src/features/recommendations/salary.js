export function normalizeMAD(input) {
  if (input == null || input === undefined) return null;
  
  const s = String(input).toLowerCase().trim();
  
  // Handle empty or dash cases
  if (s === '' || s === '—' || s === '-' || s === 'n/a') return null;
  
  // Extract numbers from the string
  const m = s.match(/(\d+[.,]?\d*)/g);
  if (!m || m.length === 0) return null;
  
  const nums = m
    .map(x => parseFloat(x.replace(',', '.')))
    .filter(n => !isNaN(n) && n > 0);
    
  if (nums.length === 0) return null;
  
  // Sort numbers to find median for ranges
  const sorted = nums.sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // Check for "k" suffix (thousands)
  const hasK = /k/.test(s);
  const multiplier = hasK ? 1000 : 1;
  
  return median * multiplier;
}

export function formatMAD(amount) {
  if (amount == null) return 'Non spécifié';
  
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}k MAD`;
  }
  
  return `${Math.round(amount)} MAD`;
}

export function getSalaryRange(min, max) {
  if (min == null && max == null) return 'Non spécifié';
  if (min == null) return `Jusqu'à ${formatMAD(max)}`;
  if (max == null) return `À partir de ${formatMAD(min)}`;
  if (min === max) return formatMAD(min);
  
  return `${formatMAD(min)} - ${formatMAD(max)}`;
}
