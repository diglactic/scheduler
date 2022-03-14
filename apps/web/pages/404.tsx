import { BookOpenIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useLocale } from "@lib/hooks/useLocale";

import { HeadSeo } from "@components/seo/head-seo";

import { ssgInit } from "@server/lib/ssg";

export default function Custom404() {
  const { t } = useLocale();

  const router = useRouter();
  const username = router.asPath.replace("%20", "-");

  const links = [
    {
      title: t("documentation"),
      description: t("documentation_description"),
      icon: DocumentTextIcon,
      href: "https://docs.cal.com",
    },
    {
      title: t("blog"),
      description: t("blog_description"),
      icon: BookOpenIcon,
      href: "https://cal.com/blog",
    },
  ];

  const [url, setUrl] = useState("https://cal.com/signup?username=");
  useEffect(() => {
    setUrl(`https://cal.com/signup?username=${username.replace("/", "")}`);
  }, [router.query]);

  return (
    <>
      <HeadSeo
        title={t("404_page_not_found")}
        description={t("404_page_not_found")}
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <div className="min-h-screen bg-white px-4">
        <main className="mx-auto max-w-xl pt-16 pb-6 sm:pt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-black">{t("error_404")}</p>
            <h1 className="font-cal mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t("page_doesnt_exist")}
            </h1>
            <span className="mt-2 inline-block text-lg">{t("check_spelling_mistakes_or_go_back")}</span>
          </div>
        </main>
      </div>
    </>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssr = await ssgInit(context);

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};
