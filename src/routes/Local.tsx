export const loader = async ({ params }: any) => {
  const config = localStorage.getItem(params.slug);
  if (!config) throw Error(`Slug ${params.slug} not found in local storage.`);
  return { config: JSON.parse(config) };
}

// this route is just a different loader for Preset
