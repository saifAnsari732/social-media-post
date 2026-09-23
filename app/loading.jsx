import LogoLoader from "@/components/ui/LogoLoader";

export default function Loading() {
  return (
    <LogoLoader 
      fullScreen={true} 
      title="Postfly" 
      message="Initializing Postfly Suite..." 
      subtext="Establishing secure connection & loading resources" 
    />
  );
}
