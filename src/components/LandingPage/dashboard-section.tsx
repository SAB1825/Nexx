import Image from 'next/image';
import AnimatedBorderTrail from '../global/animation-container';

const DashboardSection = () => {
  return (
    <section className="py-16 px-4 mt-16 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Powerful Dashboard
        </h2>
        <AnimatedBorderTrail>
        <div className="rounded-lg overflow-hidden border-4  shadow-2xl">
          <Image
            src="/dashboard-dark.svg"  // Replace with your actual image path
            alt="Dashboard Preview"
            width={1200}
            height={675}
            layout="responsive"
            className="w-full h-auto rounded-lg"
          />
        </div>
        </AnimatedBorderTrail>
      </div>
    </section>
  );
};

export default DashboardSection;

