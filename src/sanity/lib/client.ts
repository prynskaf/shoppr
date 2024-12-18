import { createClient } from "next-sanity";

// Import project configuration from environment variables
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // Pass the API token here for authentication
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: process.env.VERCEL_URL || process.env.NODE_ENV == 'production'
      ? `http://${process.env.VERCEL_URL}studio`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },
});
