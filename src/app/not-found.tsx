import type { Metadata } from "next";
import NotFoundClient from "./NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist or was moved.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
