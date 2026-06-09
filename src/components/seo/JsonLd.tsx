/**
 * JsonLd — renders structured data as a <script type="application/ld+json"> tag.
 * Usage: <JsonLd data={organizationSchema()} />
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
