import { groq } from "next-sanity";

// All projects (for /work page and home preview)
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    tags,
    year,
    sizeWork,
    sizeHome,
    coverImage,
    featured,
    "description": description
  }
`;

// Single project by slug (for /work/[slug] page)
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tags,
    year,
    liveUrl,
    liveName,
    coverImage,
    heroImage,
    solutionImage,
    "heroTag": heroTag,
    "description": description,
    "challenge": challenge,
    "approach": approach,
    "solutionCaption": solutionCaption,
    "nextProject": nextProject-> {
      title,
      "slug": slug.current
    }
  }
`;

// All slugs (for generateStaticParams)
export const projectSlugsQuery = groq`
  *[_type == "project"] { "slug": slug.current }
`;
