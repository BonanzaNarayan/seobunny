'use client';

import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ScoreDisplayProps = {
  score: number;
  rating: string;
  feedback: string;
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'hsl(var(--chart-1))';
  if (score >= 75) return 'hsl(var(--chart-2))';
  if (score >= 50) return 'hsl(var(--chart-3))';
  if (score >= 25) return 'hsl(var(--chart-4))';
  return 'hsl(var(--destructive))';
};

export function ScoreDisplay({ score, rating, feedback }: ScoreDisplayProps) {
  const color = getScoreColor(score);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Score</CardTitle>
        <CardDescription>Your metadata's estimated performance.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
        <div className="relative h-40 w-40 mx-auto md:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="75%"
              outerRadius="100%"
              barSize={12}
              data={[{ value: score }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: 'hsl(var(--muted))' }}
                dataKey="value"
                cornerRadius={10}
                fill={color}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">out of 100</span>
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
            <p className="text-xl font-semibold">
                Rating: <span style={{ color }}>{rating}</span>
            </p>
            <p className="text-muted-foreground">{feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
}
