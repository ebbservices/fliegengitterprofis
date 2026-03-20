import { getProductByHandle } from '@/lib/data/products';
import ProductConfigurator from '@/components/ProductConfigurator';

export default async function LichtschachtPage() {
  const product = await getProductByHandle('lichtschachtabdeckung-nach-mass');

  if (!product) {
    return <div className="p-20 text-center">Produkt nicht gefunden.</div>;
  }

  return (
    <ProductConfigurator
      productId={product.id}
      productTitle={product.title}
      productDescription="Stellen Sie Ihre individuelle Lichtschachtabdeckung zusammen"
      metadata={product.metadata}
      variantId={product.variants[0]?.id}
      thumbnail={product.thumbnail}
      images={product.images}
    />
  );
}
