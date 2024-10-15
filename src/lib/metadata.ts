import { Metadata } from "next";

export const generateMetadata = ({
    title = `${process.env.NEXT_PUBLIC_APP_NAME} - The Project Management Platform for Businesses`,
    description = `${process.env.NEXT_PUBLIC_APP_NAME} is the project management platform for businesses. It helps you build, brand, and track your projects.`,
    image = "logo.svg",
    icons = [
        {
            rel: "apple-touch-icon",
            sizes: "32x32",
            url: "/logo.svg"
        },
        {
            rel: "icon",
            sizes: "32x32",
            url: "/logo.svg"
        },
        {
            rel: "icon",
            sizes: "192x192",
            url: "/logo.svg"
        },
       
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    openGraph: {
        title,
        description,
        ...(image && { images: [{ url: image }] }),
    },
    twitter: {
        title,
        description,
        ...(image && { card: "summary_large_image", images: [image] }),
        creator: "@sabari",
    },
    // metadataBase: new URL(process.env.APP_DOMAIN!),
    ...(noIndex && { robots: { index: false, follow: false } }),
});
