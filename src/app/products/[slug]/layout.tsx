import { notFound } from "next/navigation";
import { homeContent } from "@/content/home";
import ProductLayoutWrapper from "@/components/shared/ProductLayoutWrapper";

export default async function ProductLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = homeContent.ourPlatforms.items.find(
    (item: any) => item.slug === resolvedParams.slug && item.category === "products"
  );

  if (!product) {
    notFound();
  }

  return (
    <>
      {children}
    </>
  );
}
