import { redirect, useLoaderData } from "react-router-dom";
import { TableConfig } from "../tableConfig";

export const loader = async ({ params }: any) => {
  if (!params.slug) return {};
  const config = localStorage.getItem(params.slug);
  if (!config) return redirect("/edit");
  return { config: JSON.parse(config) };
}

export default function Editor() {
  const { config } = useLoaderData() as { config: TableConfig };
  if (config) {
    return <div>You would be editing {config.title} here.</div>
  }
  return <div>You would be creating a new config here.</div>;
}

