import React, { useState, useRef } from 'react';
import '../image.css'

interface Props {
  username: string;
  comment_text: string;
  comment_time: string;
}

const CommentsViewItem: React.FC<Props> = ({ username, comment_text, comment_time }) => {
  return (
    <div className="commentsViewItem overflow-hidden relative">
      <div className='checkmarkBtn'>
        <p>&#x2713;</p>
      </div>
      {username}
      <h1>{comment_text}</h1>
      <p className='absolute bottom-0 right-3 text-gray-700 font-thin text-12'>{comment_time}</p>
    </div>
  );
};

export default CommentsViewItem;
