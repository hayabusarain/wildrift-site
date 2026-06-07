'use client';

interface ChampionImageProps {
  championId: string;
  championName: string;
  id: string; // Original URL ID for fallback
  className?: string;
}

export function ChampionImage({ championId, championName, id, className = "w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm" }: ChampionImageProps) {
  return (
    <img 
      src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${championId}.png`} 
      alt={championName} 
      className={className}
      onError={(e) => { 
        (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`; 
      }}
    />
  );
}
