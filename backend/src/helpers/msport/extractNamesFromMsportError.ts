function extractNamesFromMsportError(text: string) {
  const regex = /a market of (.*?) vs. (.*?)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const homeTeam = match[1].trim();
    const awayTeam = match[2].trim();
    matches.push({ homeTeam, awayTeam });
  }

  return matches;
}

export default extractNamesFromMsportError;