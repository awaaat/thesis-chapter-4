import { sanityClient } from "./sanityClient";

export async function getAllArticles() {
  return sanityClient.fetch(
    `*[_type == "article"] | order(publishDate desc){
      title, slug, category, excerpt, publishDate
    }`
  );
}

export async function getArticleBySlug(slug) {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0]{
      title, slug, category, excerpt, body, sources, publishDate, keyTakeaways
    }`,
    { slug }
  );
}

export async function getArticlesBySlugs(slugs = []) {
  if (!slugs.length) return [];
  return sanityClient.fetch(
    `*[_type == "article" && slug.current in $slugs]{
      title, slug, category, excerpt
    }`,
    { slugs }
  );
}