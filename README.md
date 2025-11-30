# Parto Ertebat Saba (Pesaba) - Next.js Website

This repository contains the source code for the **Parto Ertebat Saba** website, rebuilt with **Next.js**, **Tailwind CSS**, and **TypeScript**. It is designed for high performance, enterprise-grade aesthetics, and compatibility with static hosting services like **GitHub Pages**.

## 🚀 Features

*   **Static Site Generation (SSG):** Fully static output (`output: 'export'`) for fast loading and easy hosting.
*   **Strict Content Fidelity:** Contains all products, articles, and company information exactly as provided, preserving UUIDs and links.
*   **Enterprise Design System:**
    *   Professional Dark/Light mode support.
    *   Responsive layout for all devices.
    *   Accessible UI components.
*   **Multi-language Structure:** Ready for Persian (`fa`) and English (`en`) routing.

## 🛠️ Getting Started

### Prerequisites

*   Node.js 18+ installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/pesaba-web.git
    cd pesaba-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment to GitHub Pages

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

1.  **Push to GitHub:** Push this code to a repository on GitHub.
2.  **Configure Settings:**
    *   Go to your repository **Settings** > **Pages**.
    *   Under **Build and deployment**, select **GitHub Actions** as the source.
3.  **Trigger Deployment:**
    *   The workflow in `.github/workflows/deploy.yml` will automatically run on every push to the `master` branch.
    *   Once finished, your site will be live at `https://razavioo.github.io/pesaba.com/`.

### Note on Base Path
The `basePath` is automatically configured in `next.config.ts` to use `/pesaba.com` when building in GitHub Actions. This ensures all assets and routes work correctly on GitHub Pages.

## 🧪 Testing

Run the test suite to verify data integrity:

```bash
npm run test
```

## 📄 License

All rights reserved for Parto Ertebat Saba © 2024.
