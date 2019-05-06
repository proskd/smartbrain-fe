import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imgSrc, boxes}) => {
    
    return (
    <div className="center ma">
        <div className="absolute mt2">
            <img id='inputimage' src={imgSrc} alt='face detection target' width='500px' height="auto"></img>
            <div>
                {
                    boxes.map((box) => {
                        return (
                            <div key={box.id} className="bounding-box" style={{top:box.top, left:box.left, right:box.right, bottom:box.bottom}}></div>
                        );
                    })
                }
            </div>
        </div>
    </div>
    )
}

export default FaceRecognition;