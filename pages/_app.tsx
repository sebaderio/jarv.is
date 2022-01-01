import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import * as Fathom from "fathom-client";
import * as config from "../lib/config";
import type { AppProps } from "next/app";

import meJpg from "../public/static/images/me.jpg";
import faviconIco from "../public/static/images/favicon.ico";
import appleTouchIconPng from "../public/static/images/apple-touch-icon.png";

import "../styles/index.scss";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // https://usefathom.com/docs/integrations/next
    // https://vercel.com/guides/deploying-nextjs-using-fathom-analytics-with-vercel
    Fathom.load(config.fathomSiteId, {
      url: `https://${config.fathomCustomDomain || "cdn.usefathom.com"}/script.js`,
      includedDomains: [config.siteDomain],
    });

    const onRouteChangeComplete = () => {
      Fathom.trackPageview();
    };

    // send ping when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      // unassign event listener
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* @ts-ignore */}
      <DefaultSeo
        defaultTitle={`${config.siteName} – ${config.shortDescription}`}
        titleTemplate={`%s – ${config.siteName}`}
        description={config.longDescription}
        canonical={`${config.baseURL}/`}
        openGraph={{
          site_name: config.siteName,
          title: `${config.siteName} – ${config.shortDescription}`,
          url: `${config.baseURL}/`,
          locale: "en_US",
          type: "website",
          images: [
            {
              url: `${config.baseURL}${meJpg.src}`,
              alt: `${config.siteName} – ${config.shortDescription}`,
            },
          ],
        }}
        twitter={{
          handle: `@${config.twitterHandle}`,
          site: `@${config.twitterHandle}`,
          cardType: "summary",
        }}
        facebook={{
          appId: config.facebookAppId,
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: faviconIco.src,
          },
          {
            rel: "apple-touch-icon",
            href: appleTouchIconPng.src,
            sizes: `${appleTouchIconPng.width}x${appleTouchIconPng.height}`,
          },
          {
            rel: "manifest",
            href: "/site.webmanifest",
          },
          {
            rel: "alternate",
            href: "/feed.xml",
            type: "application/rss+xml",
            title: `${config.siteName} (RSS)`,
          },
          {
            rel: "alternate",
            href: "/feed.atom",
            type: "application/atom+xml",
            title: `${config.siteName} (Atom)`,
          },
          {
            rel: "preconnect",
            href: `https://${config.fathomCustomDomain}`,
          },
          {
            rel: "dns-prefetch",
            href: `https://${config.fathomCustomDomain}`,
          },
          {
            rel: "webmention",
            href: `https://webmention.io/${config.webmentionId}/webmention`,
          },
          {
            rel: "pingback",
            href: `https://webmention.io/${config.webmentionId}/xmlrpc`,
          },
          {
            rel: "license",
            href: "https://creativecommons.org/licenses/by/4.0/",
          },
          {
            rel: "humans",
            href: "/humans.txt",
          },
          {
            rel: "pgpkey",
            href: "/pubkey.asc",
            type: "application/pgp-keys",
          },
        ]}
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          },
          {
            name: "author",
            content: config.authorName,
          },
          {
            name: "monetization",
            content: config.monetization,
          },
          {
            name: "google-site-verification",
            content: "qQhmLTwjNWYgQ7W42nSTq63xIrTch13X_11mmxBE9zk",
          },
          {
            name: "facebook-domain-verification",
            content: "q45jxbgyp22ef55xror1pvbehisg9m",
          },
          {
            name: "msvalidate.01",
            content: "164551986DA47F7F6FC0D21A93FFFCA6",
          },
          {
            name: "yandex-verification",
            content: "634a039ec46fa286",
          },
          {
            name: "twitter:dnt",
            content: "on",
          },
        ]}
      />
      <SocialProfileJsonLd
        type="Person"
        name="Jake Jarvis"
        url={`${config.baseURL}/`}
        sameAs={[
          `${config.baseURL}/`,
          "https://github.com/jakejarvis",
          "https://keybase.io/jakejarvis",
          "https://twitter.com/jakejarvis",
          "https://medium.com/@jakejarvis",
          "https://www.linkedin.com/in/jakejarvis/",
          "https://www.facebook.com/jakejarvis",
          "https://www.instagram.com/jakejarvis/",
          "https://mastodon.social/@jakejarvis",
        ]}
      />

      {/*
        Inline script to restore light/dark theme preference ASAP:
        `<html data-theme="...">`, `<meta name="color-scheme" ...>`, and color-scheme style
      */}
      <Script id="restore_theme" strategy="afterInteractive">{`try {
  var pref = localStorage.getItem("dark_mode"),
      dark = pref === "true" || (!pref && window.matchMedia("(prefers-color-scheme: dark)").matches),
      meta = document.createElement("meta");
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  meta.setAttribute("name", "theme-color");
  meta.content = dark ? "${config.themeColorDark}" : "${config.themeColorLight}";
  document.head.prepend(meta);
} catch (e) {}`}</Script>

      <Component {...pageProps} />
    </>
  );
}