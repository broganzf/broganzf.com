import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from "@/components/ui/kibo-ui/glimpse";
import { glimpse } from "@/components/ui/kibo-ui/glimpse/server";

const sites = [
  "https://github.com",
  "https://vercel.com",
  "https://ui.shadcn.com",
  "https://tailwindcss.com",
  "https://nextjs.org/docs"
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

        return (
          <a key={i} href={data.url} target="_blank">
            <Glimpse key={i} closeDelay={0} openDelay={0}>
              <GlimpseTrigger asChild>
                <div className="relative inline-block group">
                  <p className="font-medium">{domain}</p>
                  <span
                    className="absolute inset-x-0 bottom-0 h-px bg-zinc-300 transform scale-x-0 origin-left 
    group-hover:scale-x-100 transition-transform duration-300"
                  />
                </div>
              </GlimpseTrigger>
              <GlimpseContent className="w-80 my-2">
                <GlimpseImage src={data.image || undefined} />
                <GlimpseTitle>{data.title}</GlimpseTitle>
                <GlimpseDescription>{data.description}</GlimpseDescription>
              </GlimpseContent>
            </Glimpse>
          </a>
        );
      })}
    </div>
  );
}
