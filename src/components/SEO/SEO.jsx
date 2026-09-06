import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.thesisdataanalysis.com";
const SITE_NAME = "ThesisDataAnalysis.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const CONTACT_EMAIL = "info@thesisdataanalysis.com";
// TODO: set a real handle once one exists, or delete the twitter:site tag below.
const TWITTER_HANDLE = "@thesisdataanalysis";

function buildDefaultBreadcrumbs(path, title) {
  if (!path || path === "/") return [{ name: "Home", path: "/" }];
  const label = title ? title.split("|")[0].trim() : path.replace(/^\//, "");
  return [
    { name: "Home", path: "/" },
    { name: label, path },
  ];
}

export default function SEO({
  title,
  description,
  path = "/",
  keywords,
  image = DEFAULT_IMAGE,
  imageAlt = SITE_NAME,
  jsonLd,
  noindex = false,
  breadcrumbs,
}) {
  const url = `${SITE_URL}${path}`;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: DEFAULT_IMAGE,
    email: CONTACT_EMAIL,
    areaServed: { "@type": "Country", name: "United States" },
    // TODO: add real social profile URLs (LinkedIn, Facebook, etc.)
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  const crumbTrail = breadcrumbs || buildDefaultBreadcrumbs(path, title);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbTrail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };

  const extraSchemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const robotsContent = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="author" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=no" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {extraSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
