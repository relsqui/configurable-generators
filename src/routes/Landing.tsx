import { PresetDropdown } from "../components/PresetDropdown";
import UploadButton from "../components/UploadButton";

export default function Landing() {
  return <div className="landing">
    <div><UploadButton /></div>
    <div><PresetDropdown label="Or choose a preset: " /></div>
  </div>;
}
