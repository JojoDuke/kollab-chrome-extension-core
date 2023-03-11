import React, { useState, useRef } from "react";
import './popup.css'

const Popup = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "status"){
            if (statusRef.current) {
                statusRef.current.style.display = "block";
                statusRef.current.innerText = msg.text;
            }
            if (buttonRef.current) {
                buttonRef.current.innerText = "Capturing...";
                buttonRef.current.setAttribute("disabled", "true");
            }
        }
        if (msg.type === "done"){
            if (buttonRef.current) {
                buttonRef.current.removeAttribute("disabled");
            }
        }
    });

    const takeScreenshot = () => {
        chrome.runtime.sendMessage({type: "capture"});
    }

    return (
        <div>
            <button 
                ref={buttonRef}
                onClick={takeScreenshot}>
                Take Screenshot
            </button>
            
            <div className="masterDiv">
                <div>
                    <div>theImage</div>
                    <div>
                        <h3>Screen Capture</h3>
                        <h5>Capture and share screenshots of your screen with ease</h5>
                    </div>
                </div>


            </div>
            <div ref={statusRef} id="status"></div>

        </div>
    )
};

export default Popup;
