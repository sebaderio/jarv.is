import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import fetch from "unfetch";
import canonicalUrl from "get-canonical-url";

// shared react components:
import Loading from "./components/loading.js";

// API endpoint
const HITS_ENDPOINT = "/api/hits/";

const Counter = (props) => {
  const [hits, setHits] = useState();

  // start fetching hits from API once slug is set
  useEffect(() => {
    fetch(`${HITS_ENDPOINT}?slug=${encodeURIComponent(props.slug)}`)
      .then((response) => response.json())
      .then((data) => setHits(data.hits || 0));
  }, [props.slug]);

  // show spinning loading indicator if data isn't fetched yet
  if (!hits) {
    return <Loading boxes={3} width={20} />;
  }

  // we have data!
  return (
    <span title={`${hits.toLocaleString("en-US")} ${hits === 1 ? "view" : "views"}`}>
      {hits.toLocaleString("en-US")}
    </span>
  );
};

// page must have a div#meta-hits-counter element to continue
if (typeof window !== "undefined" && document.querySelector("div#meta-hits-counter")) {
  // use <link rel="canonical"> to deduce a consistent identifier for this page
  const canonical = canonicalUrl({
    normalize: true,
    normalizeOptions: {
      removeTrailingSlash: true,
      removeQueryParameters: true,
      stripHash: true,
    },
  });

  // get path and strip beginning and ending forward slash
  const slug = new URL(canonical).pathname.replace(/^\/|\/$/g, "") || "/";

  render(<Counter slug={slug} />, document.querySelector("div#meta-hits-counter"));
}
