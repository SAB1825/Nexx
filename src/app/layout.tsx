import "./globals.css";
import { generateMetadata } from "@/lib/metadata";
import { QueryProvider  } from "@/components/query-provider";

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
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
