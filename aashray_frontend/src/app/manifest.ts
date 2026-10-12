import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aashray Infotech",
    short_name: "Aashray",
    description:
      "AI products for a safer digital planet. On-premise DPDP Act 2023 compliance and security platforms.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B2B55",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
