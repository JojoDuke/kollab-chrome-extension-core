import React from "react";
import "./options.css"

const Options = () => {
    return (
        <div id="settings">
    <h2>Settings</h2>
    <label><input step="0.1" value="1" type="number" id="SCALE_FACTOR" className="inp" min="1" max="4"/> Resolution (1 is screen resolution, 3 is 3x screen resolution)</label>
    <span className="section">
        <span className="section_text">Format:</span>
        <label><input type="radio" id="FORMAT" name="FORMAT" value="png" checked/>PNG</label>
        <label><input type="radio" id="FORMAT" name="FORMAT" value="jpeg"/>JPEG</label>
    </span>
    <label><input value="100" type="number" min="1" max="100" id="JPEG_QUALITY" data-requires="FORMAT" data-equals="jpeg" className="inp"/> JPEG quality</label>
</div>
    )
};

export default Options;