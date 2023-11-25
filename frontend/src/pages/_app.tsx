import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/toaster";
import { OPEN_GRAPH, SITE } from "~/config";
import { env } from "~/env.mjs";

import "~/styles/globals.css";

declare global {
  interface Window {
    phantom: never;
    _phantom: never;
    __nightmare: never;
    Cypress: never;
  }
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [analytics, setAnalytics] = useState<Record<string, [number, number]>>(
    {},
  );
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const onRouteChange = useCallback(() => {
    const url = window.location.pathname;
    const d = new Date();
    const dt = (d.getTime() - date.getTime()) / 1000;
    // eslint-disable-next-line prefer-const
    let [n, t] = analytics[url] ?? [Object.keys(analytics).length + 1, 0];
    t = Math.round((t + dt) * 100) / 100;
    setAnalytics({ ...analytics, [url]: [n, t] });
    setDate(d);
  }, [analytics, date]);

  const onVisibilityChange = useCallback(() => {
    // Don't send analytics if it's a bot
    if (
      window.phantom ||
      window._phantom ||
      window.__nightmare ||
      window.navigator.webdriver ||
      window.Cypress
    )
      return;

    if (document.visibilityState === "hidden") {
      const url = window.location.pathname;
      const d = new Date();
      const dt = (d.getTime() - date.getTime()) / 1000;
      // eslint-disable-next-line prefer-const
      let [n, t] = analytics[url] ?? [Object.keys(analytics).length + 1, 0];
      t = Math.round((t + dt) * 100) / 100;
      const option: RequestInit = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          d: d,
          r: document.referrer || null,
          w: window.innerWidth,
          p: { ...analytics, [url]: [n, t] },
          a: env.NEXT_PUBLIC_APP_ID,
        }),
        keepalive: true,
      };
      fetch(env.NEXT_PUBLIC_ANALYTICS_URL, { ...option })
        .then((response) => response.json())
        .catch(() => console.log("something went wrong "));
    } else {
      // Reset analytics
      setDate(new Date());
      setAnalytics({ [window.location.pathname]: [1, 0] });
    }
  }, [analytics, date]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });
    router.events.on("beforeHistoryChange", onRouteChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      router.events.off("beforeHistoryChange", onRouteChange);
    };
  }, [router.events, onVisibilityChange, onRouteChange]);

  const siteUrl = "https://betconvert.sacsbrainz.com";
  const cleanPath = router.asPath.split("#")[0]?.split("?")[0] ?? "";
  const canonicalUrl = `${siteUrl}` + (router.asPath === "/" ? "" : cleanPath);

  const imageAlt = OPEN_GRAPH.image.alt;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>Bet Converter</title>
        <meta
          name="description"
          property="og:description"
          content={SITE.description}
        />

        {/* <!-- OpenGraph Tags --> */}
        <meta property="og:title" content={SITE.title} />
        <meta property="og:type" content={"website"} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={"en"} />
        <meta property="og:image" content={`${siteUrl}/og.png`} />
        <meta property="og:image:alt" content={imageAlt} />
        <meta property="og:site_name" content={SITE.title} />

        {/* <!-- Twitter Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={OPEN_GRAPH.twitter} />
        <meta name="twitter:creator" content={OPEN_GRAPH.twitter} />
        <meta name="twitter:title" content={SITE.title} />
        <meta name="twitter:description" content={SITE.description} />
        <meta name="twitter:image" content={`${siteUrl}/og.png`} />
        <meta name="twitter:image:alt" content={imageAlt} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
