import { TableConfig } from '../tableConfig';
import { GeneratorLayout } from '../refactored/Generator';
import { presetsBySlug } from '../refactored/presets';
import { useLoaderData } from 'react-router-dom';

export const loader = async ({ params }: any) => {
  const config = presetsBySlug[params.slug] as TableConfig;
  if (!config) throw Error(`Slug ${params.slug} not found.`);
  return { config };
}

export default function Preset() {
  const { config } = useLoaderData() as { config: TableConfig };
  return <>
    <GeneratorLayout config={config} />
    <footer>
      {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
    </footer>
  </>;
}
