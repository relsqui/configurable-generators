import { ConfigDropZone } from "../refactored/ConfigDropZone";
import { PresetDropdown } from "../refactored/PresetDropdown";
import UploadButton from "../refactored/UploadButton";

export default function Landing() {
  return <ConfigDropZone>
    <UploadButton />
    <PresetDropdown label="Or use a preset: " />
  </ConfigDropZone>;
}
