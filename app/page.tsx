import ReviewsList from '../app/client/components/reviews/ReviewsList';
import ReviewForm from '../app/client/components/reviews/ReviewForm';  
import HeroSection from './components/homepage/HeroSection';
import PopularServices from './components/homepage/PopularServices';
import AboutCompany from './components/homepage/AboutCompany';
import QuickAccessButtons from './components/homepage/QuickAccessButtons';
import FooterMinimal from './components/homepage/FooterMinimal';
import Header from './components/layout/Header';


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <HeroSection />
      <PopularServices />
      <AboutCompany />
      <QuickAccessButtons />
      <h1>Home Page</h1>
      <ReviewForm />
      <ReviewsList />
      <FooterMinimal />
    </div>
  );
}
