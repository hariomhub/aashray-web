import { Metadata } from "next";
import { notFound } from "next/navigation";
import { homeContent } from "@/content/home";
import ProductResources from "@/components/shared/ProductResources";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "platforms"
  );
  if (!product) return {};
  return { title: `${product.name} Resources | Aashray Infotech` };
}

export default async function PlatformResourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "platforms"
  );

  if (!product) {
    notFound();
  }

  return <ProductResources resources={product.resources} />;
}
