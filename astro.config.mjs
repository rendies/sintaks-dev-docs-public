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
          label: "Get started",
          translations: { id: "Mulai" },
          items: [
            {
              label: "Quickstart",
              slug: "index",
              translations: { id: "Mulai cepat" },
            },
          ],
        },
        {
          label: "Models & pricing",
          translations: { id: "Model & harga" },
          items: [
            {
              label: "Model catalog",
              slug: "models",
              translations: { id: "Katalog Model" },
            },
          ],
        },
        {
          label: "Billing & account",
          translations: { id: "Penagihan & akun" },
          items: [
            {
              label: "Pricing and balance",
              slug: "guides/pricing",
              translations: { id: "Harga dan saldo" },
            },
            {
              label: "Top up your balance",
              slug: "guides/top-ups",
              translations: { id: "Top up saldo" },
            },
          ],
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
              label: "SDKs & Libraries",
              slug: "guides/sdks",
              translations: { id: "SDK & Library" },
            },
            {
              label: "TypeScript/JavaScript SDK",
              slug: "guides/sdk-javascript",
              translations: { id: "SDK TypeScript/JavaScript" },
            },
            {
              label: "Go SDK",
              slug: "guides/sdk-go",
              translations: { id: "SDK Go" },
            },
            {
              label: "SDK Reference",
              slug: "guides/sdk-reference",
              translations: { id: "Referensi SDK" },
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
          label: "Integrations",
          translations: { id: "Integrasi" },
          items: [
            {
              label: "Coding agents",
              translations: { id: "Coding agent" },
              items: [
                {
                  label: "Overview",
                  slug: "guides/coding-agents",
                  translations: { id: "Ringkasan" },
                },
                {
                  label: "OpenCode",
                  slug: "guides/coding-agents/opencode",
                },
                {
                  label: "Hermes",
                  slug: "guides/coding-agents/hermes",
                },
              ],
            },
            {
              label: "Claude Code",
              slug: "guides/claude-code",
            },
            {
              label: "VS Code",
              slug: "guides/vscode",
            },
          ],
        },
        {
          label: "API reference",
          translations: { id: "Referensi API" },
          items: [
            {
              label: "Overview",
              slug: "reference/endpoints",
              translations: { id: "Ringkasan" },
            },
            {
              label: "List models",
              slug: "reference/models",
              translations: { id: "Daftar model" },
            },
            {
              label: "Chat completions",
              slug: "reference/chat-completions",
              translations: { id: "Chat completions" },
            },
            {
              label: "Embeddings",
              slug: "reference/embeddings",
              translations: { id: "Embeddings" },
            },
            {
              label: "Image generation",
              slug: "reference/images-generations",
              translations: { id: "Generate image" },
            },
            {
              label: "Image edits",
              slug: "reference/images-edits",
              translations: { id: "Edit image" },
            },
            {
              label: "Responses",
              slug: "reference/responses",
              translations: { id: "Responses" },
            },
            {
              label: "Decisions",
              slug: "reference/decisions",
              translations: { id: "Decisions" },
            },
            {
              label: "Messages",
              slug: "reference/messages",
              translations: { id: "Messages" },
            },
            { label: "Errors", slug: "reference/errors", translations: { id: "Error" } },
          ],
        },
        { label: "Changelog", slug: "changelog", translations: { id: "Riwayat perubahan" } },
      ],
    }),
  ],
});
