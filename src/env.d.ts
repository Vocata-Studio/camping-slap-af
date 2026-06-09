/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** True when a valid Vocata preview token is present — render drafts. */
    preview: boolean;
  }
}
