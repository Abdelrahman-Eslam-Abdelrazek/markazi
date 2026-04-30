import * as React from "react";
import { cn } from "../theme/utils";
import { Card, CardContent } from "../primitives/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
            {trend && (
              <p
                className={cn("text-xs font-medium", trend.isPositive ? "text-emerald-600" : "text-red-600")}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
