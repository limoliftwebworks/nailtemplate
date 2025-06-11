// app/layout.tsx
import "./main.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/context/ConfigContext";
import CursorProvider from "@/components/CursorProvider";
import ClientConfigApplier from "@/components/ClientConfigApplier";
import ClientStylesApplier from "@/components/ClientStylesApplier";
import localConfig from "../config/localConfig";

// Custom cursor styles are now entirely in cursor.css which is imported in globals.css
// This avoids hydration issues with inline styles and quote escaping

// Get loading screen config
const loadingConfig = localConfig.loadingScreen || {
  enabled: true,
  backgroundColor: "#FFFFFF",
  logoImage: "TC-TITLE.png",
  logoWidth: 280,
  logoAlt: "Taylor's Collision",
  spinner: {
    enabled: true,
    color: "#1d4ed8",
    size: 60,
    thickness: 4,
  },
  timing: {
    minimumDisplayTime: 2000,
    fadeOutDuration: 600,
  },
};

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-ubuntu",
  display: "swap",
});

// Generate metadata from localConfig
export const generateMetadata = (): Metadata => {
  const browserConfig = localConfig.browser || {};
  const faviconFolder = browserConfig.faviconFolder || "favicon";

  return {
    title: browserConfig.title || "Davis Tree Service",
    description:
      localConfig.description || "Professional tree removal services",
    icons: {
      icon: [
        { url: `/${faviconFolder}/favicon.ico`, type: "image/x-icon" },
        {
          url: `/${faviconFolder}/favicon-32x32.png`,
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: `/${faviconFolder}/favicon-16x16.png`,
          type: "image/png",
          sizes: "16x16",
        },
      ],
      shortcut: [
        { url: `/${faviconFolder}/favicon.ico`, type: "image/x-icon" },
      ],
      apple: [
        { url: `/${faviconFolder}/apple-touch-icon.png`, sizes: "180x180" },
      ],
      other: [{ rel: "manifest", url: `/${faviconFolder}/site.webmanifest` }],
    },
  };
};

// Generate viewport configuration
export const generateViewport = () => {
  const browserConfig = localConfig.browser || {};

  return {
    themeColor: browserConfig.themeColor || localConfig.themeColor || "#1e40af",
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the localConfig directly
  const config = localConfig;

  // Check if loading screen is enabled
  const isLoadingEnabled = loadingConfig.enabled !== false;

  // Define class names for HTML element (without server-side mobile detection)
  const htmlClasses = `${ubuntu.variable} scroll-smooth no-js`;

  return (
    <html lang="en" className={htmlClasses} suppressHydrationWarning>
      <head>
        {/* Critical inline CSS to prevent FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS Variables - Available immediately */
            :root {
              --theme-color: ${config.themeColor || "#e68bbe"};
              --theme-color-light: ${config.themeColor || "#e68bbe"}22;
              --info-bar-color: ${config.infoBar?.backgroundColor || "#e68bbe"};
              --nav-text-color: ${config.navBar?.textColor || "#e68bbe"};
              --nav-bg-color: ${config.navBar?.backgroundColor || "#ffffff"};
              --hero-gradient-top: ${
                config.pages?.Home?.heroGradientTop || "#f4b8da"
              };
              --hero-gradient-bottom: ${
                config.pages?.Home?.heroGradientBottom || "#ffffff"
              };
            }
            
            /* Critical layout styles to prevent layout shifts */
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              font-family: 'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(to bottom, var(--hero-gradient-top), var(--hero-gradient-bottom));
              min-height: 100vh;
              font-display: swap;
            }
            
            *, *::before, *::after {
              font-family: 'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            /* Info bar critical styles */
            .info-bar {
              background-color: var(--info-bar-color);
              color: white;
              padding: 0.5rem 0;
              font-size: 0.875rem;
            }
            
            /* Navigation critical styles */
            .nav-bar {
              background-color: var(--nav-bg-color);
              border-bottom: 1px solid #f3f4f6;
              position: sticky;
              top: 0;
              z-index: 50;
            }
            
            /* Prevent font flash */
            .font-ubuntu {
              font-family: 'Ubuntu', system-ui, -apple-system, sans-serif;
            }
          `,
          }}
        />

        {/* Critical font loading to prevent font flash */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
        />

        {/* Firefox FOUC fix - dummy script */}
        <script dangerouslySetInnerHTML={{ __html: "0" }} />
      </head>
      <body
        className={`antialiased bg-white ${ubuntu.variable} font-ubuntu`}
        suppressHydrationWarning
      >
        {/* Site content - no loading overlay needed */}
        <ConfigProvider>
          <CursorProvider>
            <ClientConfigApplier />
            <ClientStylesApplier
              config={config}
              loadingConfig={loadingConfig}
            />
            {children}
          </CursorProvider>
        </ConfigProvider>

        {/* Simple scroll position preservation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            // Scroll position preservation
            const SCROLL_KEY = 'nail_salon_scroll_position';
            
            // Save scroll position before page unloads
            function saveScrollPosition() {
              try {
                const scrollY = window.scrollY || window.pageYOffset;
                const scrollX = window.scrollX || window.pageXOffset;
                localStorage.setItem(SCROLL_KEY, JSON.stringify({ x: scrollX, y: scrollY }));
              } catch (e) {
                // Ignore localStorage errors
              }
            }
            
            // Restore scroll position
            function restoreScrollPosition() {
              try {
                const savedPosition = localStorage.getItem(SCROLL_KEY);
                if (savedPosition) {
                  const position = JSON.parse(savedPosition);
                  requestAnimationFrame(() => {
                    window.scrollTo(position.x, position.y);
                  });
                }
              } catch (e) {
                // Ignore errors
              }
            }
            
            // Event listeners
            if (typeof window !== 'undefined') {
              window.addEventListener('beforeunload', saveScrollPosition);
              
              // Restore scroll position after page loads
              window.addEventListener('load', () => {
                setTimeout(restoreScrollPosition, 100);
              });
              
              // Remove no-js class
              document.documentElement.classList.remove('no-js');
            }
          })();
        `,
          }}
        />
      </body>
    </html>
  );
}
