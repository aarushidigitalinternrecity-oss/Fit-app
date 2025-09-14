import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PersonStanding } from "lucide-react";

export default function MuscleHeatmap() {

  // In a real app, this would be dynamic based on workout data
  const trainedMuscles = {
    shoulders: 'fill-primary/70',
    chest: 'fill-primary/90',
    biceps: 'fill-primary/50',
    abs: 'fill-primary/20',
    quads: 'fill-primary/90',
    calves: 'fill-primary/30',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PersonStanding className="text-primary" />
          Muscle Heatmap
        </CardTitle>
        <CardDescription>Muscle groups trained this week. The brighter, the more recent.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" className="h-[200px]">
            {/* Head */}
            <circle cx="100" cy="40" r="30" fill="hsl(var(--muted))"/>
            {/* Neck */}
            <rect x="90" y="70" width="20" height="20" fill="hsl(var(--muted))"/>
            {/* Torso */}
            <path d="M70,90 L130,90 L120,200 L80,200 Z" fill="hsl(var(--muted))"/>
            {/* Shoulders */}
            <path d="M70,90 L50,110 L70,130 Z" className={trainedMuscles.shoulders || 'fill-muted'} />
            <path d="M130,90 L150,110 L130,130 Z" className={trainedMuscles.shoulders || 'fill-muted'}/>
            {/* Chest */}
            <path d="M80,100 L120,100 L120,140 L80,140 Z" className={trainedMuscles.chest || 'fill-muted'} />
            {/* Abs */}
            <path d="M85,145 L115,145 L110,195 L90,195 Z" className={trainedMuscles.abs || 'fill-muted'} />
            {/* Arms */}
            <path d="M50,110 L40,210 L60,210 L70,130 Z" fill="hsl(var(--muted))"/>
            <path d="M150,110 L160,210 L140,210 L130,130 Z" fill="hsl(var(--muted))"/>
            {/* Biceps */}
            <path d="M50,130 C 60,140, 60,160, 55,170 L45,160 C 50,150, 50,140, 50,130 Z" className={trainedMuscles.biceps || 'fill-muted'} />
            <path d="M150,130 C 140,140, 140,160, 145,170 L155,160 C 150,150, 150,140, 150,130 Z" className={trainedMuscles.biceps || 'fill-muted'} />
            {/* Legs */}
            <path d="M80,200 L70,380 L100,380 L100,200 Z" fill="hsl(var(--muted))"/>
            <path d="M120,200 L130,380 L100,380 L100,200 Z" fill="hsl(var(--muted))"/>
            {/* Quads */}
            <path d="M75,210 L95,210 L95,300 L75,300 Z" className={trainedMuscles.quads || 'fill-muted'}/>
            <path d="M105,210 L125,210 L125,300 L105,300 Z" className={trainedMuscles.quads || 'fill-muted'}/>
             {/* Calves */}
            <path d="M75,320 L95,320 L95,370 L75,370 Z" className={trainedMuscles.calves || 'fill-muted'}/>
            <path d="M105,320 L125,320 L125,370 L105,370 Z" className={trainedMuscles.calves || 'fill-muted'}/>
          </svg>
      </CardContent>
    </Card>
  );
}
