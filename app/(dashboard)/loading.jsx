import LogoLoader from "@/components/ui/LogoLoader";

export default function DashboardLoading() {
  return (
    <LogoLoader 
      fullScreen={true} 
      title="Postfly" 
      message="Loading Workspace..." 
      subtext="Syncing social channels, posts and live metrics" 
    />
  );
}
