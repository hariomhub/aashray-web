import { homeContent } from "@/content/home";
import { productDetails } from "@/content/productDetails";
import ProductOverview from "@/components/shared/ProductOverview";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import JsonLd, { getSoftwareAppSchema, getBreadcrumbSchema, getVideoSchema } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return homeContent.ourPlatforms.items
    .filter((item: any) => item.category === "platforms")
    .map((item: any) => ({
      slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "platforms"
  );
  if (!product) return {};

  const title = `${product.name} - ${product.tagline || "DPDP Compliance Platform"}`;
  const description =
    product.description ||
    `${product.name} is an AI-powered platform for DPDP Act compliance by Aashray Infotech.`;
  const url = `https://www.aashrayinfotech.com/platforms/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      ...(product.features?.map((f: any) => f.bold) || []),
      "DPDP Act compliance platform",
      "Aashray Infotech",
      "data privacy India",
    ],
    alternates: {
      canonical: `/platforms/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Aashray Infotech`,
      description,
      url,
      type: "website",
      images: [
        {
          url: `https://www.aashrayinfotech.com/products/${product.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${product.name} - Aashray Infotech`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Aashray Infotech`,
      description,
      images: [`https://www.aashrayinfotech.com/products/${product.slug}.png`],
    },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "platforms"
  );

  if (!product) {
    notFound();
  }

  // Derive the description from tagline or manual description
  const description = product.description || product.tagline;
  const detailedFeatures = productDetails[product.slug] || product.features;

  const appSchema = getSoftwareAppSchema({
    name: product.name,
    description,
    url: `/platforms/${product.slug}`,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Platforms", url: "/#products" },
    { name: product.name, url: `/platforms/${product.slug}` },
  ]);

  const videoSchema = product.demoVideo
    ? getVideoSchema({
        name: `${product.name} Platform Demonstration`,
        description: `Explore ${product.name} by Aashray Infotech - AI-guided DPDP Act compliance and enterprise governance.`,
        thumbnailUrl: `/products/${product.slug}.png`,
        contentUrl: product.demoVideo,
      })
    : null;

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={breadcrumbs} />
      {videoSchema && <JsonLd data={videoSchema} />}
      <ProductOverview
        name={product.name}
        slug={product.slug}
        features={detailedFeatures}
        description={description}
        image={product.image}
        demoVideo={product.demoVideo}
      />
    </>
  );
}

