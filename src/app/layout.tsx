import "./globals.css";
import { generateMetadata } from "@/lib/metadata";
import { QueryProvider  } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <QueryProvider>
        <Toaster />

        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
