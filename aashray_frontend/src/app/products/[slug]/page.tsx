import { homeContent } from "@/content/home";
import { productDetails } from "@/content/productDetails";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductOverview from "@/components/shared/ProductOverview";
import JsonLd, { getSoftwareAppSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return homeContent.ourPlatforms.items
    .filter((item: any) => item.category === "products")
    .map((item: any) => ({
      slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "products"
  );
  if (!product) return {};

  const title = `${product.name} - ${product.tagline || "DPDP Compliance & Security"}`;
  const description =
    product.description ||
    `${product.name} provides on-premise protection and DPDP compliance engineering by Aashray Infotech.`;
  const url = `https://www.aashrayinfotech.com/products/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      ...(product.features?.map((f: any) => f.bold) || []),
      "DPDP Act compliance",
      "Aashray Infotech",
      "data protection",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Aashray Infotech`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Aashray Infotech`,
      description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "products"
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
    url: `/products/${product.slug}`,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/#products" },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={breadcrumbs} />
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

