import React, { useRef, useState, useEffect } from "react";
import "./image.css";
import axios from "axios";
import CommentsViewItem from "./imageComponents/CommentsViewItem";
import ResolvedCommentsViewItem from "./imageComponents/ResolvedCommentsViewItem";
import OtherProjectsFolder from "./imageComponents/OtherProjectsFolder";
import UserSettings from "./imageComponents/UserSettings";

const ImagePic: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const commentsViewRef = useRef<HTMLDivElement>(null);

    // Get the current date from local machine
    const now = new Date();
    const theTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // States for the Comments Box
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');
    const [commentsStatus, setCommentsStatus] = useState("unresolved");
    const [resolvedComments, setResolvedComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);

    // States for Canvas and buttons
    const [pencilIconColor, setPencilIconColor] = useState('#d9d9d9');
    const [addTextIconColor, setAddTextColor] = useState('#d9d9d9');
    const [isAddingText, setIsAddingText] = useState(false);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [isAddingDrawing, setIsAddingDrawing] = useState(false);
    const [isPencilSelected, setIsPencilSelected] = useState(false);
    const [canvasState, setCanvasState] = useState<string>('');
    const [selectedButton, setSelectedButton] = useState('home');
    const [isFolderClicked, setIsFolderClicked] = useState(false);
    const [isSettingsClicked, setIsSettingsClicked] = useState(false);

    // Fetch comments when the component mounts
    useEffect(() => {
        axios.get('https://kollab-core-server-jojoamankwa.koyeb.app/')
            .then(response => {
                const allComments = response.data;
                const updatedComments = allComments.map(comment => ({
                    ...comment,
                    username: 'Username',
                }));

                setComments(updatedComments.filter(comment => !comment.comment_resolved));
                setResolvedComments(updatedComments.filter(comment => comment.comment_resolved));
                setIsCommentsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsCommentsLoading(false);
            });

            setUsername('Username')

            
        }, []);

        // Function to switch selected/focused sidebar button
        const switchSidebarButton = (buttonName) => {
            setSelectedButton(buttonName);
            
            if (buttonName === 'folder') {
                setIsFolderClicked(true);
            } else {
                setIsFolderClicked(false);
            }

            if (buttonName === 'settings') {
                setIsSettingsClicked(true);
            } else {
                setIsSettingsClicked(false);
            }
        };

    // Change comment status
    const handleCommentStatusChange = (e) => {
        setCommentsStatus(e.target.value);
    };

    // Function for when the send button is clicked
    const handleSendClick = () => {
        const commentInput = document.querySelector('.comment_input input') as HTMLInputElement;
        const commentText = commentInput.value;

        // Check if the input is empty
        if (commentText === '') {
            alert('Please enter a comment');
            return;
          }

        //A POST request function that adds a comment to the database
        axios.post("https://kollab-core-server-jojoamankwa.koyeb.app/addComment", {
            comment_text: commentText, // The text in the input box
            comment_time: theTime, // Post the current time when comment is sent
            comment_resolved: false,
        })
            .then((response) => {
                commentInput.value = '';

                const newComment = { 
                    id: response.data.id,
                    comment_text: commentText,
                    username: username,
                    comment_time: theTime,
                    comment_resolved: false, // set the initial resolved status to false
                  };
                
                if (commentsStatus === "unresolved") {
                    setComments([...comments, newComment]);
                } else {
                    setResolvedComments([...resolvedComments, newComment]);
                }

            }).catch((error) => alert(JSON.stringify(error.response)));
    }

    // Scroll to the bottom of the view on any new comment
    useEffect(() => {
        scrollToBottom();
      }, [comments]);
      
      // Scroll to bottom function
      const scrollToBottom = () => {
        commentsViewRef.current.scrollTop = commentsViewRef.current.scrollHeight;
        commentsViewRef.current.style.scrollBehavior = 'smooth';
      };

    // Callback function to move comment to resolved list
    const markAsResolved = async (comment) => {
        // Update the comment to 'Resolved' in the database
        await axios.put(`https://kollab-core-server-jojoamankwa.koyeb.app/updateComment/${comment._id}`, {
            comment_resolved: true,
        })
            .then((response) => {
                // Remove comment from comments state
                setComments(comments.filter((c) => c !== comment));
                
                // Add comment to resolvedCommentList
                setResolvedComments([...resolvedComments, comment]);
            })
            .catch((err) => {
                alert(JSON.stringify(err.response));
            });
            
    };

    //Same callback function to move a resolved comment to unresolved status
    const markAsUnresolved = async (comment) => {
        // Update the comment to 'Unresolved' in the database
        await axios.put(`https://kollab-core-server-jojoamankwa.koyeb.app/updateComment/${comment._id}`, {
            comment_resolved: false,
        })
            .then((response) => {
                setResolvedComments(resolvedComments.filter((rc) => rc !== comment));
                comment.comment_resolved = false; // Update the comment_resolved property to false
                setComments([...comments, comment]);
            })
            .catch((err) => {
                alert(JSON.stringify(err.response));
            });
    };

    // Render comments in the commentsView div
    let commentItems;
    if (commentsStatus === "unresolved") {
        commentItems = comments.map(comment => {
            return <CommentsViewItem 
                        key={comment._id} 
                        username={comment.username} 
                        comment_time={comment.comment_time} 
                        comment_text={comment.comment_text} 
                        comment_resolved={comment.comment_resolved}
                        onResolve={() => markAsResolved(comment)} />;
        });
    } else {
        commentItems = resolvedComments.length > 0 ? (resolvedComments.map((comment) => 
            <ResolvedCommentsViewItem 
                key={comment._id} 
                username={comment.username} 
                comment_time={comment.comment_time} 
                comment_text={comment.comment_text} 
                comment_resolved={comment.comment_resolved}
                onUnresolve={() => markAsUnresolved(comment)} />)) 
                : (<div className="no-comment">No resolved comments yet</div>);
    }

    // Function for when enter is pressed on input
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSendClick();
        }
      }

      const pencilSelectedColor = isAddingDrawing && isPencilSelected ? 'green' : '#d9d9d9';
      const textSelectedColor = isAddingText && isTextSelected ? 'red' : '#d9d9d9';

    // Function for when the pencil button is clicked
    const handlePencilClick = () => {
        setIsPencilSelected(true);
        setIsTextSelected(false);
        setIsAddingDrawing(true);
        setIsAddingText(false);
        setPencilIconColor('green');
        setAddTextColor('#d9d9d9');
    };

    // Function for when the add text button is clicked
    const handleAddTextClick = () => {
        setIsPencilSelected(false);
        setIsTextSelected(true);
        setIsAddingDrawing(false);
        setIsAddingText(true);
        setAddTextColor('red');
        setPencilIconColor('#d9d9d9');
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (isAddingText && isTextSelected) {
            canvas.style.cursor = "text";
          } else {
            canvas.style.cursor = "default";
          }

        const container = canvasContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        let containerScrollTop = 0;
        let containerScrollLeft = 0;

        if (container.scrollHeight > container.clientHeight || container.scrollWidth > container.clientWidth) {
            containerScrollTop = container.scrollTop;
            containerScrollLeft = container.scrollLeft;
        }

        // Code that enables drawing on the canvas
        if (isAddingDrawing && isPencilSelected) {
            // Boolean to check the drawing status
            let isDrawing = false;
    
            window.addEventListener("load", () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            });
    
            const startDraw = (e) => {
                isDrawing = true;
                ctx.beginPath();

                // Request animation frame for smoother drawing
                requestAnimationFrame(() => {
                    drawing(e);
                });
            }
    
            const drawing = (e) => {
                if (isDrawing) {
                  const x = e.clientX - containerRect.left - containerScrollLeft;
                  const y = e.clientY - containerRect.top - containerScrollTop;
                  ctx.lineTo(x * (canvas.width / canvasWidth), y * (canvas.height / canvasHeight));
                  ctx.stroke();
                  ctx.lineWidth = 10;
                }
              }
              
    
            canvas.addEventListener("mousedown", startDraw);
            canvas.addEventListener("mousemove", drawing);
            canvas.addEventListener("mouseup", () => {
                isDrawing = false;

                //Save the canvas once the user is done drawing
                axios.post("https://kollab-core-server-jojoamankwa.koyeb.app/saveCanvas", {
                    canvasData: canvas.toDataURL()
                })
                    .then((response) => {
                        console.log(response);
                    })
            });
    
            return () => {
                window.addEventListener("load", () => {
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;
                });
    
                canvas.removeEventListener("mousedown", startDraw);
                canvas.removeEventListener("mousemove", drawing);
                canvas.removeEventListener("mouseup", () => {
                    isDrawing = false;
                });
            };
        }

        // Code for adding text to the canvas
        if (isAddingText && isTextSelected) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });

            // Add text function
            const addText = (e) => {
                // Get x and y coordinates of the canvas
                const x = e.clientX - containerRect.left - containerScrollLeft;
                const y = e.clientY - containerRect.top - containerScrollTop;

                e.preventDefault();
                
                // The input view when adding text
                const addTextInput = document.createElement("input");
                addTextInput.type = "text";
                addTextInput.style.position = "absolute";
                addTextInput.style.left = `${x}px`;
                addTextInput.style.top = `${y - 10}px`;
                addTextInput.style.backgroundColor = "transparent";
                addTextInput.style.border = "none";
                addTextInput.style.width = "100px";
                addTextInput.style.height = "20px";
                addTextInput.style.zIndex = "1";
                addTextInput.style.display = "flex";
                addTextInput.style.justifyContent = "center";
                addTextInput.style.alignItems = "center";
                addTextInput.style.cursor = "text";
                addTextInput.value = "";

                addTextInput.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      e.preventDefault();
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext("2d");
                      ctx.font = "40px Arial";
                      ctx.fillText(addTextInput.value, x * (canvas.width / canvasWidth), y * (canvas.height / canvasHeight));
                      addTextInput.remove();
                      //setIsAddingText(false);
                    }
                });

                // Add/Append the input to the canvas container
                container.appendChild(addTextInput);
                
                // Timeout for 50 ms after input element is added
                setTimeout(() => {
                    //Automatically focus the input after its added
                    addTextInput.focus();
                }, 50);
            };

            // on mouse down
            canvas.addEventListener("mousedown", addText);

            return () => {
                canvas.removeEventListener("mousedown", addText);
            };
        };
    }, [pencilIconColor, addTextIconColor]);
    

    // Getting the image and putting it on the canvas
    chrome.runtime.sendMessage({ type: "getImage" }, (msg) => {
        if (msg.type === "image") {
            let blob_url = URL.createObjectURL(toBlob(msg.data));

            const canvasContainer = canvasContainerRef.current;
            canvasContainer.style.position = "relative";
            const canvas = canvasRef.current,
            ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.imageSmoothingEnabled = false;

            const canvasImg = new Image();
            canvasImg.src = msg.data;
            
            canvasImg.onload = function() {
                canvas.width = canvasImg.width;
                canvas.height = canvasImg.height;
                ctx.drawImage(canvasImg, 0, 0, canvasImg.width, canvasImg.height);
                const imageData = ctx.getImageData(0, 0, canvasImg.width, canvasImg.height);
                ctx.putImageData(imageData, 0, 0);
                ctx.imageSmoothingEnabled = false;
            }

            const savedDrawingData = canvas.toDataURL();
            localStorage.setItem('savedDrawing', savedDrawingData);
            

            // The magnify icon and its styling
            const magnifyBtn = document.createElement("button");
            magnifyBtn.style.backgroundColor = "#cd87f9";
            magnifyBtn.style.border = "none";
            magnifyBtn.style.width = "35px";
            magnifyBtn.style.height = "35px";
            magnifyBtn.style.borderRadius = "50%";
            magnifyBtn.style.position = "fixed";
            magnifyBtn.style.top = "110px";
            magnifyBtn.style.right = "570px";
            magnifyBtn.style.display = "flex";
            magnifyBtn.style.justifyContent = "center";
            magnifyBtn.style.alignItems = "center";
            canvasContainer.appendChild(magnifyBtn);

            //Magnify icon
            const magnifyIcon = document.createElement("img");
            magnifyIcon.src = "https://cdn-icons-png.flaticon.com/512/545/545651.png";
            magnifyIcon.width = 15;
            magnifyBtn.appendChild(magnifyIcon);

            //Fullscreen view of image when clicked
            magnifyBtn.onclick = () => {
                window.open(blob_url);
            }

        }
    });

    // Function that converts the image data to a blob
    function toBlob(dataURI: string) {
        var byteString = atob(dataURI.split(",")[1]);
        var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });
        return blob;
    }

    return (
        <div className="main">
            <div className="wrapper">
                <div className="sidebar">
                    <div className="logo-div cursor-pointer">
                        <img src="tempLogo.png" alt="kollab-logo" />
                    </div>
                    <div className="sidebar-buttons">
                        <div className={`home ${selectedButton === 'home' ? 'selected' : ''}`} onClick={() => switchSidebarButton('home')}>
                            <img src={selectedButton === 'home' ? 'home-filled.png' : 'home-outline.png'} alt="home" />
                        </div>
                        <div className={`folder ${selectedButton === 'folder' ? 'selected' : ''}`} onClick={() => switchSidebarButton('folder')}>
                            <img src={selectedButton === 'folder' ? 'folder-filled.png' : 'folder-outline.png'} alt="other-projects" />
                        </div>
                        <div className={`settings ${selectedButton === 'settings' ? 'selected' : ''}`} onClick={() => switchSidebarButton('settings')}>
                            <img src={selectedButton === 'settings' ? 'settings-filled.png' : 'settings-outline.png'} alt="settings" />
                        </div>
                    </div>
                    <div className="exit">
                        <img src="logout-red.png" alt="logout" />
                    </div>
                </div>
            </div>

            <div className="topbar">
                <div className="image-name-div">
                    <img src="img-icon.png" alt="image-icon" width="35"/>
                    <p>Image Name</p>
                </div>
                <div className="triggers">
                    <button className="shareboard-btn cursor-pointer">Share Board</button>
                    <button className="circle_button" id="pencilIcon" onClick={handlePencilClick} style={{ backgroundColor: pencilSelectedColor }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png" width="20px"/>
                    </button>
                    <button className="circle_button" id="addTextIcon" onClick={handleAddTextClick} style={{ backgroundColor: textSelectedColor }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2087/2087807.png" width="20px"/>
                    </button>
                </div>
                <div className="user-profile-div">
                    <div>
                        <p>Username</p>
                        <p>Email</p>
                    </div>
                    <div className="user-profile-image">
                        {/*<img src="" alt="user-profile-image" />*/}
                    </div>
                </div>
            </div>

            <div>
                {isFolderClicked ? (<OtherProjectsFolder/>) : isSettingsClicked ? (<UserSettings/>) :
                    (<div className="mainSelectedDiv">
                            <div id="canvasContainer" ref={canvasContainerRef}>
                                <canvas ref={canvasRef}>
                                </canvas>
                            </div>

                        <div className="comment_area">
                            <div className="comment_status">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    value="unresolved" 
                                    id="unresolved" 
                                    checked={commentsStatus === "unresolved"}
                                    onChange={handleCommentStatusChange}
                                    defaultChecked />
                                <label htmlFor="unresolved">Unresolved</label>
                                <input 
                                    type="radio" 
                                    name="status" 
                                    value="resolved" 
                                    id="resolved"
                                    checked={commentsStatus === "resolved"}
                                    onChange={handleCommentStatusChange} />
                                <label htmlFor="resolved">Resolved</label>
                            </div>

                            <div className="commentsView" ref={commentsViewRef}>
                                {commentItems}
                            </div>

                            <div className="comment_input">
                                <input type="text" placeholder="Write a comment" onKeyDown={handleKeyPress}/>
                                <div className="commentButtons">
                                    <button className="circle_button" id="sendIcon" onClick={handleSendClick}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3024/3024593.png" width="20px"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePic;
