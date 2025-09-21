import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Files, 
  HardDrive, 
  Upload, 
  AlertTriangle,
  Calendar,
  TrendingUp
} from "lucide-react";
import type { DocumentStats as DocumentStatsType } from "../../types";

interface DocumentStatsProps {
  stats: DocumentStatsType;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentStats = ({ stats }: DocumentStatsProps) => {
  const { total, totalSize, recentUploads, expiringCount, expiredCount } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-caption-refined text-muted-foreground">Total Documents</CardTitle>
          <Files className="h-4 w-4 icon-luxury" />
        </CardHeader>
        <CardContent>
          <div className="text-heading-xl text-foreground">{total}</div>
          <p className="text-xs text-muted-foreground">Across all categories</p>
        </CardContent>
      </Card>

      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-caption-refined text-muted-foreground">Storage Used</CardTitle>
          <HardDrive className="h-4 w-4 icon-luxury" />
        </CardHeader>
        <CardContent>
          <div className="text-heading-xl text-foreground">{formatFileSize(totalSize)}</div>
          <p className="text-xs text-muted-foreground">
            Total file size
          </p>
        </CardContent>
      </Card>

      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-caption-refined text-muted-foreground">Recent Uploads</CardTitle>
          <Upload className="h-4 w-4 icon-luxury" />
        </CardHeader>
        <CardContent>
          <div className="text-heading-xl text-foreground">{recentUploads}</div>
          <p className="text-xs text-muted-foreground">
            Last 7 days
          </p>
        </CardContent>
      </Card>

      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-caption-refined text-muted-foreground">Expiring Soon</CardTitle>
          <Calendar className="h-4 w-4 icon-luxury" />
        </CardHeader>
        <CardContent>
          <div className="text-heading-xl text-orange-600">{expiringCount}</div>
          <p className="text-xs text-muted-foreground">
            Within reminder period
          </p>
        </CardContent>
      </Card>

      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-caption-refined text-muted-foreground">Expired</CardTitle>
          <AlertTriangle className="h-4 w-4 icon-luxury" />
        </CardHeader>
        <CardContent>
          <div className="text-heading-xl text-red-600">{expiredCount}</div>
          <p className="text-xs text-muted-foreground">
            Need attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentStats;