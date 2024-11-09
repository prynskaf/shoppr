// import { defineQuery } from "next-sanity";
// import { sanityFetch } from "../live";

// export const getAllProducts = async () => {
//   const ALL_PRODUCTS_QUERY = defineQuery(`
//     *[
//         _type == "product"
//     ] | order(name asc)
//     `);

//   try {
//     // Use sanityFetch to send the query
//     const products = await sanityFetch({
//       query: ALL_PRODUCTS_QUERY,
//     });
//     //   Return the list of the products, or an empty list if none are found
//     return products || [];
//   } catch (error) {
//     console.error("Error fetching all products", error);
//     return [];
//   }
// };

// Updated getAllProducts function
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
    *[ _type == "product" ] | order(name asc)
  `);

  try {
    const result = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    });
    // Return only the `data` array if `result` is an object with `data`
    return result.data || [];
  } catch (error) {
    console.error("Error fetching all products", error);
    return [];
  }
};
