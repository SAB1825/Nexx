import { UserButton } from "@/features/auth/components/UserButton";
import Image from "next/image";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: LayoutProps) => {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between w-full bg-black  border-b border-white/10 pb-4">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={30} height={50} />
                <p className="text-white text-3xl font-bold">exx</p>
            </Link>
            <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
            {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
