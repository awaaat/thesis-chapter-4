import { Route } from "react-router-dom";
import { landingPages } from "./landingData";
import { LandingPage, ServicesHub } from "./LandingPage";

export function landingRoutes() {
  return [
    <Route key="hub" path="/data-analysis-services" element={<ServicesHub />} />,
    ...landingPages.map((p) => <Route key={p.slug} path={`/${p.slug}`} element={<LandingPage page={p} />} />),
  ];
}
