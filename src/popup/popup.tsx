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
            <h1 className="mt-2 text-lg text-center text-purple-600 font-bold">Kollab</h1>
            <div className="mt-1 mb-1 h-0.5 w-4/5 bg-slate-100 mx-auto"></div>
            <button 
                ref={buttonRef}
                onClick={takeScreenshot}
                style={{ left: "50%", transform: "translate(-50%, 0)", width: "80%" }}
                className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded mx-auto w-70 absolute bottom-0 mb-3 transition-colors duration-350 ease-in-out">
                Take Screenshot
            </button>
            <div ref={statusRef} id="status"></div>

        </div>
    )
};

export default Popup;
