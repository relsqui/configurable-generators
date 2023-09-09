import { PresetDropdown } from "../refactored/PresetDropdown";
import UploadButton from "../refactored/UploadButton";

export default function Landing() {
  return <div className="landing">
    <div><UploadButton /></div>
    <div><PresetDropdown label="Or use a preset: " /></div>
  </div>;
}
