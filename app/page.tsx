import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import AboutCompany from '../components/home/AboutCompany';
import PopularServices from '../components/home/PopularServices';
import ProjectPreview from '@/components/home/ProjectPreview';
import QuickAccessButtons from '../components/home/QuickAccessButtons';
import ReviewsList from '../components/client/reviews/ReviewsList';
import FooterMinimal from '../components/layout/FooterMinimal';
import ChatButton from '@/components/home/ChatButton';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <QuickAccessButtons />
      <main className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-10 space-y-24">
        <AboutCompany />
        <PopularServices />
        <ProjectPreview />
        <ReviewsList />
        <ChatButton />
      </main>
      <FooterMinimal />
    </>
  );
}
