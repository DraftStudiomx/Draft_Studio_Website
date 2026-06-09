import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function ContactLayout({ children }: { children: React.ReactNode }) {
  // next-intl middleware sets locale context on all routes including /contact
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
