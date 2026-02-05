import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                     <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-10 w-1/2" />
                    </div>
                     <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                     <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-10 w-1/2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function OptimizationSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in-50">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
}
