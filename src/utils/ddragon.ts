export async function getDDragonIconMap(): Promise<Record<string, string>> {
  try {
    const map: Record<string, string> = {};
    
    // Fetch Items
    const resItems = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const dataItems = await resItems.json();
    for (const key of Object.keys(dataItems.data)) {
      const item = dataItems.data[key];
      const normalizedName = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      map[normalizedName] = `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image.full}`;
    }

    // Fetch Runes
    const resRunes = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/runesReforged.json`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const dataRunes = await resRunes.json();
    for (const tree of dataRunes) {
      for (const slot of tree.slots) {
        for (const rune of slot.runes) {
          const nameNormalized = rune.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const keyNormalized = rune.key.toLowerCase();
          const url = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
          map[nameNormalized] = url;
          map[keyNormalized] = url;
        }
      }
    }
    
    return map;
  } catch (err) {
    console.error('Failed to fetch icon map from DDragon:', err);
    return {};
  }
}
