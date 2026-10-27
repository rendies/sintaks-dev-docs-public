import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.sintaks.dev",
  output: "static",
  integrations: [
    starlight({
      title: "sintaks.dev docs",
      logo: {
        light: "./public/sintaks-logo.svg",
        dark: "./public/sintaks-logo-dark.svg",
        alt: "sintaks.dev",
        replacesTitle: true,
      },
      description: "OpenAI-compatible AI API for Indonesian developers.",
      defaultLocale: "id",
      locales: {
        id: { label: "Bahasa Indonesia", lang: "id" },
        en: { label: "English", lang: "en" },
      },
      customCss: ["./src/styles/custom.css"],
      // Brand is light-first: seed the theme to light for first-time visitors.
      // Runs during parse, before first paint, so there is no flash.
      head: [
        {
          tag: "script",
          content:
            "try{if(!localStorage.getItem('starlight-theme')){localStorage.setItem('starlight-theme','light');document.documentElement.dataset.theme='light';}}catch(e){}",
        },
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://trakk.id/#organization",
                name: "PT Trakk Digital Indonesia",
                url: "https://trakk.id/",
              },
              {
                "@type": "WebSite",
                "@id": "https://docs.sintaks.dev/#website",
                url: "https://docs.sintaks.dev/",
                name: "sintaks.dev documentation",
                publisher: { "@id": "https://trakk.id/#organization" },
              },
            ],
          }),
        },
      ],
      social: [],
      sidebar: [
        {
          label: "Quickstart",
          slug: "index",
          translations: { id: "Mulai cepat" },
        },
        {
          label: "Guides",
          translations: { id: "Panduan" },
          items: [
            {
              label: "Authentication",
              slug: "guides/authentication",
              translations: { id: "Autentikasi" },
            },
            {
              label: "Pricing and balance",
              slug: "guides/pricing",
              translations: { id: "Harga dan saldo" },
            },
            {
              label: "Top-ups with iPaymu",
              slug: "guides/top-ups",
              translations: { id: "Top up lewat iPaymu" },
            },
            {
              label: "SDKs & Libraries",
              slug: "guides/sdks",
              translations: { id: "SDK & Library" },
            },
            {
              label: "Examples",
              slug: "guides/examples",
              translations: { id: "Contoh" },
            },
            {
              label: "Troubleshooting",
              slug: "guides/troubleshooting",
              translations: { id: "Pemecahan masalah" },
            },
          ],
        },
        {
          label: "API reference",
          translations: { id: "Referensi API" },
          items: [
            {
              label: "Endpoints",
              slug: "reference/endpoints",
              translations: { id: "Endpoint" },
            },
            { label: "Errors", slug: "reference/errors", translations: { id: "Error" } },
          ],
        },
        { label: "Changelog", slug: "changelog", translations: { id: "Riwayat perubahan" } },
      ],
    }),
  ],
});
