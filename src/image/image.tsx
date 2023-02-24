import React, { useRef, useState, useEffect } from "react";
import "./image.css";
import axios from "axios";
import CommentsViewItem from "./imageComponents/commentsViewItem";

const ImagePic: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const commentsViewRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const theTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');
    const [pencilIconColor, setPencilIconColor] = useState('#d9d9d9');
    const [savedState, setSavedState] = useState<string>('');

    const scrollToBottom = () => {
        const commentsView = commentsViewRef.current;
        const isScrolledToBottom = commentsView.scrollTop + commentsView.clientHeight === commentsView.scrollHeight;
      
        commentsView.scrollTop = commentsView.scrollHeight;
      
        if (!isScrolledToBottom) {
          commentsViewRef.current.style.scrollBehavior = 'smooth';
        } else {
          commentsViewRef.current.style.scrollBehavior = 'auto';
        }

        //
        commentsViewRef.current.addEventListener('scroll', () => {
            const commentsView = commentsViewRef.current;
            const isScrolledToBottom = commentsView.scrollTop + commentsView.clientHeight === commentsView.scrollHeight;
          
            if (isScrolledToBottom) {
              commentsViewRef.current.style.scrollBehavior = 'smooth';
            } else {
              commentsViewRef.current.style.scrollBehavior = 'auto';
            }
          });  
      };

    // Fetch comments when the component mounts
    useEffect(() => {
        axios.get('http://localhost:5000/')
            .then(response => {
                //setComments(response.data);
                setComments(response.data.map(comment => ({
                    ...comment,
                    username: 'Username',
                  })));
                  
            })
            .catch(error => {
                console.error(error);
            });

            setUsername('Username');

            
        }, []);

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
        axios.post("http://localhost:5000/addComment", {
            comment_text: commentText,
            //Post the current time when comment is sent
            comment_time: theTime
        })
            .then((response) => {
                commentInput.value = '';
                scrollToBottom();

                const newComment = { id: response.data.id, comment_text: commentText, username: username, comment_time: theTime };
                setComments([...comments, newComment]);

            }).catch((error) => alert(error.response));
    }

    // Render comments in the commentsView div
    const commentItems = comments.map(comment => {
        return <CommentsViewItem key={comment.id} username={comment.username} comment_time={comment.comment_time} comment_text={comment.comment_text} />;
    });

    // Function for when enter is pressed on input
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleSendClick();
        }
      }


    // Function for when the pencil icon is clicked
    const handlePencilClick = () => {
        const newColor = pencilIconColor === '#d9d9d9' ? 'green' : '#d9d9d9';
        if (newColor === "#d9d9d9") {
            // Restore image from state
            const canvas = canvasRef.current;
            setSavedState(canvas.toDataURL());
        }
        setPencilIconColor(newColor);
    };

    useEffect(() => {
        if (pencilIconColor === "green") {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
            let isDrawing = false;
    
            window.addEventListener("load", () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            });
    
            const startDraw = (e) => {
                if (savedState) {
                    // Restore image from state
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });
                    const img = new Image();
                    img.onload = () => {
                      ctx.drawImage(img, 0, 0);
                    };
                    img.src = savedState;
                    setSavedState('');
                }
                isDrawing = true;
                ctx.beginPath();
            }
    
            const drawing = (e) => {
                if (isDrawing) {
                    const canvas = canvasRef.current;
                    const container = canvasContainerRef.current;
                    const containerRect = container.getBoundingClientRect();
                    const canvasWidth = containerRect.width;
                    const canvasHeight = containerRect.height;
                    const x = e.clientX - containerRect.left;
                    const y = e.clientY - containerRect.top;
                    ctx.lineTo(x * (canvas.width / canvasWidth), y * (canvas.height / canvasHeight));
                    ctx.stroke();
                    ctx.lineWidth = 10;
                }
            }
    
            canvas.addEventListener("mousedown", startDraw);
            canvas.addEventListener("mousemove", drawing);
            canvas.addEventListener("mouseup", () => {
                isDrawing = false;
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
    }, [pencilIconColor]);
    

    chrome.runtime.sendMessage({ type: "getImage" }, (msg) => {
        if (msg.type === "image") {
            let blob_url = URL.createObjectURL(toBlob(msg.data));

            const canvasContainer = canvasContainerRef.current;
            canvasContainer.style.position = "relative";
            const canvas = canvasRef.current,
            ctx = canvas.getContext("2d");
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
            magnifyBtn.style.top = "30px";
            magnifyBtn.style.right = "470px";
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
                    <div className="profile">
                        <img src="https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png" alt="profile_picture"/>
                        <h3>Username</h3>
                        <div className="line"></div>
                        <div className="img1"></div>
                    </div>
                </div>
            </div>

            <div id="canvasContainer" ref={canvasContainerRef}>
                <canvas ref={canvasRef}>
                </canvas>
            </div>

            <div className="comment_area">
                <div className="comment_status">
                    <input type="radio" name="status" value="unresolved" id="unresolved" defaultChecked />
                    <label htmlFor="unresolved">Unresolved</label>
                    <input type="radio" name="status" value="resolved" id="resolved" />
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
                        <button className="circle_button" id="pencilIcon" onClick={handlePencilClick} style={{ backgroundColor: pencilIconColor }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png" width="20px"/>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ImagePic;
