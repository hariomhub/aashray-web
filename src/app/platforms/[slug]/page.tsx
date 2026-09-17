import { homeContent } from "@/content/home";
import ProductOverview from "@/components/shared/ProductOverview";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
  return { title: `${product.name} Overview | Aashray Infotech` };
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

  return <ProductOverview name={product.name} slug={product.slug} features={product.features} description={description} />;
}
