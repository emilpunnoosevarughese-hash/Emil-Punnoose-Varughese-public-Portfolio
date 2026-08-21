import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function PlaceholderPage({ title, icon: Icon, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-8">
      <div className="p-4 rounded-full bg-primary/10 mb-6">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">{title}</h1>
      <p className="text-lg text-gray-500 max-w-lg">
        {description}
      </p>
      <div className="mt-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
        Coming soon in Phase 2
      </div>
    </div>
  );
}
