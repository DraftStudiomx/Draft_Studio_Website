import { defineField, defineType } from "sanity";

// Reusable bilingual text field helper
const bilingualText = (name: string, title: string, rows = 3) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "es", title: "Español", type: "text", rows }),
      defineField({ name: "en", title: "English", type: "text", rows }),
    ],
  });

const bilingualString = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "object",
    description,
    fields: [
      defineField({ name: "es", title: "Español", type: "string" }),
      defineField({ name: "en", title: "English", type: "string" }),
    ],
  });

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    // ─── Identity (no translation needed) ───────────────────────
    defineField({
      name: "title",
      title: "Client / Project Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower number = shown first",
    }),
    defineField({
      name: "featured",
      title: "Show in home preview",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "tags",
      title: "Tags / Services",
      type: "string",
      description: "e.g. Web Design · Development",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),

    // ─── Card sizes ──────────────────────────────────────────────
    defineField({
      name: "sizeWork",
      title: "Card Size — /work page",
      type: "string",
      description: "Aspect ratio of the card in the full work grid",
      options: {
        list: [
          { title: "XL — cuadrado alto (4/4.7)", value: "xl" },
          { title: "Wide — horizontal (16/11)", value: "wide" },
          { title: "Tall — portrait (4/5)", value: "tall" },
        ],
        layout: "radio",
      },
      initialValue: "wide",
    }),
    defineField({
      name: "sizeHome",
      title: "Card Size — Home preview",
      type: "string",
      description: "Solo aplica si 'Show in home preview' está activado",
      hidden: ({ document }) => !document?.featured,
      options: {
        list: [
          { title: "Large — columna izquierda grande (span 2 rows)", value: "lg" },
          { title: "Small — columna derecha", value: "sm" },
        ],
        layout: "radio",
      },
      initialValue: "sm",
    }),

    // ─── Bilingual text ──────────────────────────────────────────
    bilingualString("description", "Short Description", "Shown in the work grid card"),
    bilingualString("heroTag", "Hero Tag", "e.g. Hero — Editorial cover"),
    bilingualText("challenge", "Challenge", 4),
    defineField({
      name: "approach",
      title: "Approach (paragraphs)",
      type: "object",
      description: "Each language gets its own list of paragraphs",
      fields: [
        defineField({
          name: "es",
          title: "Español",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [{ type: "text" }],
        }),
      ],
    }),
    bilingualString("solutionCaption", "Solution Caption"),

    // ─── Images (shared across languages) ───────────────────────
    defineField({
      name: "coverImage",
      title: "Cover Image",
      description: "Card thumbnail (shown in /work grid and home preview)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      description: "Full-width image at the top of the case study (16:9 recommended)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "solutionImage",
      title: "Solution Image",
      description: "Full-width image in the Solution section",
      type: "image",
      options: { hotspot: true },
    }),

    // ─── Links ───────────────────────────────────────────────────
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "liveName",
      title: "Live URL Label",
      type: "string",
      description: "e.g. estudiosnacionales.com →",
    }),

    // ─── Navigation ──────────────────────────────────────────────
    defineField({
      name: "nextProject",
      title: "Next Project",
      type: "reference",
      to: [{ type: "project" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "coverImage",
    },
  },
});
