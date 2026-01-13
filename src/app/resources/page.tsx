import { GlimpseItem } from "@/components/ui/kibo-ui/glimpse/resources";
import { glimpse } from "@/components/ui/kibo-ui/glimpse/server";

const sites = [
  "https://github.com",
  "https://vercel.com",
  "https://ui.shadcn.com",
  "https://tailwindcss.com",
  "https://nextjs.org/docs",
  "https://heroui.com/docs/guide/introduction",
  "https://kibo-ui.com/docs",
];

export default async function Home() {
  const dataList = await Promise.all(
    sites.map(async (url) => {
      const data = await glimpse(url);
      return { ...data, url };
    })
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2">
      {dataList.map((data, i) => {
        const domain = new URL(data.url).hostname.replace("www.", "");

        return <GlimpseItem key={i} data={data} domain={domain} index={i} />;
      })}
    </div>
  );
}
