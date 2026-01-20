import PartyCrewBuilder from "@/components/PartyCrewBuilder";
import JaraBot from "@/components/jarabot";

const PartyCrewPage = () => {
  return (
    <>
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Party Crew Builder</h1>
            <p className="text-xl text-muted-foreground">
              Build and manage your event planning team
            </p>
          </div>
          <PartyCrewBuilder />
        </div>
      </main>
      <JaraBot />
    </>
  );
};

export default PartyCrewPage;
