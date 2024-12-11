import BlackFridayBanner from "@/components/BlackFridayBanner";
import ProductsView from "@/components/ProductsView";
import { getaAllCategories } from "@/sanity/lib/products/getaAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";



export default async function Home() {
  // Fetch the products from the API
  const products = await getAllProducts();
  const categories = await getaAllCategories();



  return (
    <div className="">
      <BlackFridayBanner />

      {/* render all the products */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 P-4 ">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

