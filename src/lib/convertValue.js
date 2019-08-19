export function convertValue(value, type) {
  if (type.substring(0, 3) === 'Int' || type.substring(0, 5) === 'Float') if (!isNaN(value)) return Number(value);
  return value;
}