import React from 'react';
import '../image.css'

interface Props {
  username: string;
  time: string;
}

const CommentsViewItem: React.FC<Props> = ({ username, time }) => {
  return (
    <div className="commentsViewItem overflow-hidden relative">
      {username}
      <h1>Hello, this is a test to see what comments look like</h1>
      <p className='absolute bottom-0 right-3 text-gray-700 font-thin text-12'>{time}</p>
    </div>
  );
};

export default CommentsViewItem;
