import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// npm install next-sanity@canary
export const backendClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
});
