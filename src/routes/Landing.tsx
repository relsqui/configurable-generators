import { ConfigDropZone } from "../refactored/ConfigDropZone";
import { TableConfig } from "../tableConfig";

export default function Landing({ configLoadedCallback}: {configLoadedCallback: (config: TableConfig) => void}) {
  return <ConfigDropZone configLoadedCallback={configLoadedCallback} />;
}
