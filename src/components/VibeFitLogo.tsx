import { Dumbbell } from 'lucide-react';

export function TurboGrannyLogo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="size-7 text-primary" />
      <h1 className="text-2xl font-bold text-white">
        Turbo<span className="text-primary">Granny</span>
      </h1>
    </div>
  );
}
