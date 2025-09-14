import { Dumbbell } from 'lucide-react';

export function VibeFitLogo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="size-7 text-primary" />
      <h1 className="text-2xl font-bold text-white">
        Vibe<span className="text-primary">Fit</span>
      </h1>
    </div>
  );
}
