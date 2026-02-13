import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2 bg-slate-800 p-1 rounded-lg">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 bg-slate-700" />
        ))}
      </div>
      
      <div className="text-center py-2">
        <Skeleton className="h-4 w-96 mx-auto bg-slate-700" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-slate-700 bg-slate-900">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 bg-slate-700" />
                <Skeleton className="h-4 w-56 bg-slate-700" />
              </div>
              <Skeleton className="h-9 w-24 bg-slate-700" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-5/6 bg-slate-700" />
            <Skeleton className="h-4 w-4/6 bg-slate-700" />
            <div className="mt-4">
              <Skeleton className="h-3 w-32 bg-slate-700" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}