
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import { taskBundles, getTaskBundle, TaskTemplate } from "../../data/taskTemplates";

interface TaskBundlesProps {
  onAddBundle: (tasks: TaskTemplate[]) => void;
}

const TaskBundles = ({ onAddBundle }: TaskBundlesProps) => {
  const currentSeason = getCurrentSeason();
  
  // Show seasonal bundles first if it's the right season
  const sortedBundles = [...taskBundles].sort((a, b) => {
    if (a.seasonal && a.season === currentSeason) return -1;
    if (b.seasonal && b.season === currentSeason) return 1;
    return 0;
  });

  const handleAddBundle = (bundleId: string) => {
    const bundle = getTaskBundle(bundleId);
    if (bundle && bundle.taskTemplates) {
      onAddBundle(bundle.taskTemplates);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Quick Task Bundles</h3>
        <Badge variant="outline" className="text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          {currentSeason}
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {sortedBundles.map((bundle) => {
          const isSeasonalMatch = bundle.seasonal && bundle.season === currentSeason;
          
          return (
            <Card 
              key={bundle.id} 
              className={`hover:shadow-md transition-shadow ${
                isSeasonalMatch ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{bundle.icon}</span>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {bundle.name}
                        {isSeasonalMatch && (
                          <Badge variant="secondary" className="text-xs">
                            Perfect for {currentSeason}!
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {bundle.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {bundle.tasks.length} tasks included
                  </span>
                  <Button 
                    size="sm"
                    onClick={() => handleAddBundle(bundle.id)}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to determine current season
function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export default TaskBundles;
