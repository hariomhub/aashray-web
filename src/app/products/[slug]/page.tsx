import { homeContent } from "@/content/home";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductOverview from "@/components/shared/ProductOverview";

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
  return { title: `${product.name} Overview | Aashray Infotech` };
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

  return <ProductOverview name={product.name} slug={product.slug} features={product.features} description={description} />;
}
