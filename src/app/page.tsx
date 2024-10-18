
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/UserButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  
  const user = await getCurrent();
  console.log({user})
  

  return (
    <div className="bg-black h-screen w-screen">
      <UserButton />
      {
        user ? 
        <Link href="/dashboard">
          <Button>
            Dashboard
          </Button>
        </Link>
          :
        <Link href="/sign-in">
          <Button>
            Sign In
          </Button>
          </Link>
      }
    </div>
  );
}
