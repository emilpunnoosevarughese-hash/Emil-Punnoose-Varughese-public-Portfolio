import { useState, useEffect } from 'react';
import { dataProvider } from '../data/dataProvider';
import { profileData as initialProfile } from '../data/profile';

// import { tutorialsData as initialTutorials } from '../data/tutorials';
// import { socialLinks as initialSocials } from '../data/socials';
import { db } from '../lib/firebase';

import { Hero } from '../components/sections/Hero';
import { InteractiveIdCard } from '../components/sections/InteractiveIdCard';
import { Projects } from '../components/sections/Projects';
import { GamesSection } from '../components/sections/GamesSection';
import { TechStackSection } from '../components/sections/TechStackSection';
// import { ShowcaseSection } from '../components/sections/ShowcaseSection';
// import { TutorialSection } from '../components/sections/TutorialSection';
import { PhotographySection } from '../components/sections/PhotographySection';
import { ContactSection } from '../components/sections/ContactSection';
// import { ServicesSection } from '../components/sections/ServicesSection';

export function Home() {
  const [profileData, setProfileData] = useState<any>(initialProfile);
  // projectsData is no longer needed as state in Home since Projects component handles its own data now
  // const [tutorialsData, setTutorialsData] = useState<any[]>(initialTutorials);
  // const [socialLinks, setSocialLinks] = useState<any[]>(initialSocials);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [profile] = await Promise.all([
          dataProvider.getProfile(),
          // dataProvider.getProjects(), is now handled internally or statically by Projects
          // dataProvider.getTutorials(),
          // dataProvider.getSocials()
          
        ]);
        setProfileData({ ...initialProfile, ...profile, images: initialProfile.images });
        // setTutorialsData(tutorials as any[]);
        // setSocialLinks(socials as any[]);
              } catch (e) {
        console.error("Error loading portfolio data:", e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Hero profileData={profileData} />

      <InteractiveIdCard />

      <TechStackSection />

      <Projects />

      <GamesSection />

      <PhotographySection profileData={profileData} />

      <ContactSection />

      {/* Temporarily hidden sections as requested
      <ShowcaseSection />
      
      <TutorialSection tutorialsData={tutorialsData} />
      
      <ServicesSection />
      */}

      {/* Dev Mode Status Pill */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50 glass-effect px-4 py-2 rounded-full flex items-center space-x-3 text-xs font-mono shadow-2xl border border-[var(--color-border)]">
          {db ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_var(--color-success)] animate-pulse" />
              <span className="text-success font-bold tracking-widest">LIVE DB</span>
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)]" />
              <span className="text-[var(--color-warning)] font-bold tracking-widest">LOCAL DATA</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
