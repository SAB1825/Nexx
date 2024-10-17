
import { getCurrent } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/UserButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  console.log({user})
  if(!user) {
    
    redirect("/sign-in")
  }

  return (
    <div className="bg-black h-screen w-screen">
      <UserButton />
    </div>
  );
}
