import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 必ず class に設定
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // globals.cssの変数と紐付け
        background: "var(--background)",
        card: {
          DEFAULT: "var(--card-bg)",
          border: "var(--card-border)",
        },
        main: "var(--text-main)",
        sub: "var(--text-sub)",
        muted: "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        status: {
          pending: {
            bg: "var(--status-pending-bg)",
            text: "var(--status-pending-text)",
            border: "var(--status-pending-border)",
          },
          urgent: {
            bg: "var(--status-urgent-bg)",
            text: "var(--status-urgent-text)",
          },
        },
        btn: {
          primary: {
            bg: "var(--btn-primary-bg)",
            text: "var(--btn-primary-text)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;