import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Specialty {
  name: string;
  count: number;
}

interface StateSummaryProps {
  state: string;
  summaryHtml: string;
  storeCount: number;
  topSpecialty: string;
  cityCount: number;
}

export function StateSummary({
  state,
  summaryHtml,
  storeCount,
  topSpecialty,
  cityCount,
}: StateSummaryProps) {
  return (
    <div className="w-full bg-blue-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Summary Text */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              About Fish Stores in {state}
            </h2>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: summaryHtml }}
            />
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Stores
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{storeCount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Most Common
                </h3>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-foreground">{topSpecialty}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Cities Covered
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{cityCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
