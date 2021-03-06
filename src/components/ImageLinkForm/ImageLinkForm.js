import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onDetectSubmitted}) => {
    return (
    <div>
        <p className="f3">
        {
            'This magic brain detects images.  Give it a try!'
        }
        </p>
        <div className="center">
            <div className="pa4 br3 shadow-5 form center">
                <input className="f4 pa2 w-70 center" type="text" onChange={onInputChange}></input>
                <button className="w-30 grow f4 link ph3 pv2 dib bg-light-purple" onClick={onDetectSubmitted}>Detect</button>
            </div>
        </div>
    </div>
    )
}

export default ImageLinkForm;