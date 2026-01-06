import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ダークモードを有効化
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // globals.css の変数と Tailwind クラス名を紐付け
        background: "var(--background)",
        main: "var(--text-main)",
        sub: "var(--text-sub)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        card: {
          DEFAULT: "var(--card-bg)",
          border: "var(--card-border)",
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