import React, { useState, useRef } from "react";
import './popup.css'

const Popup = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isScHovered, setIsScHovered] = useState(false);
    const [isFpcHovered, setIsFpcHovered] = useState(false);
    const [isKhHovered, setIsKhHovered] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    // Mouse enter and leave for first button
    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

      // Mouse enter and leave for second button
      const handleScMouseEnter = () => {
        setIsScHovered(true);
      };
    
      const handleScMouseLeave = () => {
        setIsScHovered(false);
      };

      // Mouse enter and leave for third button
      const handleFpcMouseEnter = () => {
        setIsFpcHovered(true);
      };
    
      const handleFpcMouseLeave = () => {
        setIsFpcHovered(false);
      };

      // Mouse enter and leave for last button
      const handleKhMouseEnter = () => {
        setIsKhHovered(true);
      };
    
      const handleKhMouseLeave = () => {
        setIsKhHovered(false);
      };

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
            <div className="masterDiv">
                {/* Free Selector Capture */}
                <div className="fscHover" style={{ backgroundColor: isHovered ? '#ebd2fd' : 'transparent', opacity: isHovered ? 1 : 0 }}></div>
                <div className="flex items-center px-4 cursor-pointer mt-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img className="mr-4 w-10 h-10" src="selective-capture-icon.png" alt="screen-capture-icon" />
                    <div>
                        <h3 className="text-purple-800" style={{ fontSize: "12px", }}>Free Selector</h3>
                        <h5 className="text-gray-600" style={{ fontSize: "10px", }}>Capture the most important parts of your screen</h5>
                    </div>
                </div>
                <div className="w-4/5 bg-gray-100 my-2 mx-auto" style={{ height: "1px", }}></div>

                {/* Screen Capture */}
                <div className="scHover" style={{ backgroundColor: isScHovered ? '#ebd2fd' : 'transparent', opacity: isScHovered ? 1 : 0 }}></div>
                <div className="flex items-center px-4 cursor-pointer" onClick={takeScreenshot} onMouseEnter={handleScMouseEnter} onMouseLeave={handleScMouseLeave}>
                    <img className="mr-4 w-10 h-10" src="screen-capture-icon.png" alt="screen-capture-icon" />
                    <div>
                        <h3 className="text-purple-800" style={{ fontSize: "12px", }}>Screen Capture</h3>
                        <h5 className="text-gray-600" style={{ fontSize: "10px", }}>Capture and share screenshots of your screen with ease</h5>
                    </div>
                </div>
                <div className="w-4/5 bg-gray-100 my-2 mx-auto" style={{ height: "1px", }}></div>


                {/* Full Page Capture */}
                <div className="fpcHover" style={{ backgroundColor: isFpcHovered ? '#ebd2fd' : 'transparent', opacity: isFpcHovered ? 1 : 0 }}></div>
                <div className="flex items-center px-4 cursor-pointer" onMouseEnter={handleFpcMouseEnter} onMouseLeave={handleFpcMouseLeave}>
                    <img className="mr-4 w-10 h-10" src="fullscreen-icon.png" alt="screen-capture-icon" />
                    <div>
                        <h3 className="text-purple-800" style={{ fontSize: "12px", }}>Full Page Capture</h3>
                        <h5 className="text-gray-600" style={{ fontSize: "10px", }}>Effortlessly save entire webpages as images</h5>
                    </div>
                </div>
                <div className="w-4/5 bg-gray-100 my-2 mx-auto" style={{ height: "1px", }}></div>

                {/* Kollab Home */}
                <div className="khHover" style={{ backgroundColor: isKhHovered ? '#ebd2fd' : 'transparent', opacity: isKhHovered ? 1 : 0 }}></div>
                <div className="flex items-center px-4 mb-4 cursor-pointer" onMouseEnter={handleKhMouseEnter} onMouseLeave={handleKhMouseLeave}>
                    <img className="mr-4 w-10 h-10" src="kollabhome-icon.png" alt="screen-capture-icon" />
                    <div>
                        <h3 className="text-purple-800" style={{ fontSize: "12px", }}>Kollab Home</h3>
                        <h5 className="text-gray-600" style={{ fontSize: "10px", }}>Head over to the dashboard</h5>
                    </div>
                </div>

            </div>
            <div ref={statusRef} id="status"></div>

        </div>
    )
};

export default Popup;
