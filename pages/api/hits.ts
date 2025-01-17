import { prisma } from "../../lib/helpers/prisma";
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
  regions: ["iad1"], // the vercel postgres database lives in DC
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  // simultaneously fetch the entire hits db and notes from the filesystem
  const pages = await prisma.hits.findMany({
    orderBy: [
      {
        hits: "desc",
      },
    ],
  });

  const total = { hits: 0 };

  // calculate total hits
  pages.forEach((page) => {
    // add these hits to running tally
    total.hits += page.hits;
  });

  return NextResponse.json({ total, pages }, { status: 200 });
};
