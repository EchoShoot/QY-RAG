import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Annoyed } from 'lucide-react';

interface ParsedPageCardProps {
  page: string;
  content: string;
}

export function ParsedPageCard({ page, content }: ParsedPageCardProps) {
  return (
    <Card className="bg-bg-card border-0 rounded-3xl">
      <CardContent className="p-4">
        <p className="text-text-secondary text-base">{page}</p>
        <div className="text-text-primary text-base mt-2">{content}</div>
      </CardContent>
    </Card>
  );
}

interface ChunkCardProps {
  activated: boolean;
  content: string;
}

export function ChunkCard({ content }: ChunkCardProps) {
  return (
    <Card className="bg-bg-card border-0 rounded-3xl">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <Annoyed />
          <div className="flex items-center space-x-2">
            <Switch />
            <span className="text-text-primary">Active</span>
          </div>
        </div>
        <div className="text-text-primary text-base mt-2 line-clamp-4">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
