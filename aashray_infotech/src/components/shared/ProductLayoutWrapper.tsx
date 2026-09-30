
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductHero from "./ProductHero";

interface ProductLayoutWrapperProps {
  children: React.ReactNode;
  product: {
    name: string;
    tagline?: string;
    image?: string;
    slug: string;
    category: string;
    isPlaceholder?: boolean;
    placeholderText?: string;
  };
}

export default function ProductLayoutWrapper({ children, product }: ProductLayoutWrapperProps) {
  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
          <ProductBreadcrumb category={product.category} name={product.name} />
          
          <ProductHero 
            name={product.name}
            tagline={product.tagline}
            image={product.image}
            slug={product.slug}
            category={product.category}
            isPlaceholder={product.isPlaceholder}
            placeholderText={product.placeholderText}
          />
          
          {children}
        </div>
    </div>
  );
}
