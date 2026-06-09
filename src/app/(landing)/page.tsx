import {
  Heart,
  Sparkles,
  Palette,
  Globe,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import {
  templates,
  recommendedSections,
} from "@/components/data/wedding";
import Link from "next/link";
import Testimonials from "./(section)/Testimonials";
import CTA from "./(section)/CTA";
import TechStack from "./(section)/TechStack";
import Recommended from "./(section)/Recommended";
import Templates from "./(section)/Templates";
import Features from "./(section)/Features";
import Hero from "./(section)/Hero";

export default function page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero/>

      {/* Features Section */}
      <Features/>

      {/* Templates Section */}
      <Templates/>

      {/* Recommended Sections */}
      <Recommended/>

      {/* Tech Stack */}
      <TechStack />

      {/* CTA Section */}
      <CTA />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
