import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "5q5grbf2",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // fast, cached reads — fine for published content
});