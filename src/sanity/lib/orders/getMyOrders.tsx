import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live"

export async function getMyOrders(userId: string) {
    if(!userId){
        throw new Error('User ID is required')
    }

    // define the query to get orders based on the user Id, sorted by orderDate descending
    const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
        ...,
        products[]{
            ...,
            product-> 
        }
    }
    `)

    try {
        const orders = await sanityFetch({
            query: MY_ORDERS_QUERY,
            params: { userId, },
        })
        return orders.data ||  [];
        
    } catch (error) {
        console.error("Error fetching orders for user", error)
        throw new Error("Failed to fetch orders. Please try again.");       
    }

    
}