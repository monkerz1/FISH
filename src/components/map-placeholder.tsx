'use client';

export function MapPlaceholder() {
  return (
    <div className="w-full h-screen min-h-96 bg-gradient-to-br from-muted to-muted-foreground rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-muted-foreground text-xl font-medium">Map Coming Soon</div>
        <p className="text-muted-foreground text-sm mt-2">
          Interactive map view will be available shortly
        </p>
      </div>
    </div>
  );
}
