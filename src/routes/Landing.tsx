import { useNavigate } from "react-router-dom";
import { PresetDropdown } from "../components/PresetDropdown";
import UploadButton from "../components/UploadButton";

export default function Landing() {
  const navigate = useNavigate();
  return <div className="landing">
    <div><PresetDropdown label="Choose a preset: " /></div>
    <div><UploadButton /></div>
    <div><button onClick={() => navigate("/edit")}>Create a new config</button></div>
  </div>;
}
