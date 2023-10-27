const map = count("Quinoline was first extracted from coal tar in 1834 by German chemist Friedlieb Ferdinand Runge;[4] he called quinoline leukol (\"white oil\" in Greek).[7] Coal tar remains the principal source of commercial quinoline.[8] In 1842, French chemist Charles Gerhardt obtained a compound by dry distilling quinine, strychnine, or cinchonine with potassium hydroxide;[4] he called the compound Chinoilin or Chinolein.[9] Runge's and Gephardt's compounds seemed to be distinct isomers because they reacted differently. However, the German chemist August Hoffmann eventually recognized that the differences in behaviors was due to the presence of contaminants and that the two compounds were actually identical.[10] The only report of quinoline as a natural product is from the Peruvian stick insect Oreophoetes peruana. They have a pair of thoracic glands from which they discharge a malodorous fluid containing quinoline when disturbed.[11]")
function count(string: string) {
  const map = new Map<string, number>();
  for (let index = 0; index < string.length; index++) {
    const element = string.charAt(index).toLowerCase();
    map.set(element, stupidNullCheckedMapGet(map, element) + 1);

  }
  return map;
}
function stupidNullCheckedMapGet(map: Map<string, number>, key: string) {
  const value: number | undefined = map.get(key);
  if (typeof value === "undefined") {
    return 0;
  } else {
    return value;
  }
}
for (const [key, value] of map.entries()) {
  console.log(key + " : " + value);
}