import { useNavigate } from "react-router-dom";
import { PresetDropdown } from "../components/PresetDropdown";
import UploadButton from "../components/UploadButton";

export default function Landing() {
  const navigate = useNavigate();
  return <>
    <main className="landing">
      <div className="landingContainer">
        <h1 className="invisible">Configurable Generators</h1>
        <div><PresetDropdown label="Choose a preset: " /></div>
        <div><UploadButton /></div>
        <div>Or <button onClick={() => navigate("/edit")}>create your own generator</button>!</div>
      </div>
    </main>
  </>;
}
