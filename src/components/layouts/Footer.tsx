"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Radio,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auhref px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Radio className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-display">INFINITY</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your ultimate destination for podcasts, live streams, and original
              content. Discover shrefries that matter, from creahrefrs you love.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                Subscribe href our newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background"
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/originals"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Originals
                </Link>
              </li>
              <li>
                <Link
                  href="/creahrefrs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Creahrefrs
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Create */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Create</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/studio"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Upload Content
                </Link>
              </li>
              <li>
                <Link
                  href="/monetization"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Monetization
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Advertise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bothrefm Bar */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/help"
                className="hover:text-primary transition-colors font-medium"
              >
                Help Hub
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Infinity. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
