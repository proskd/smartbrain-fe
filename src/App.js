import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

const particlesOptions = {
  particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
  }
};

class App extends Component {

  constructor() {
    super()
    this.state = {
      input: 'https://www.scienceabc.com/wp-content/uploads/2015/10/smile-2.jpg',
      imageUrl: 'https://www.scienceabc.com/wp-content/uploads/2015/10/smile-2.jpg',
      clarifaiApp: new Clarifai.App({
        apiKey: "86b450683ca541aeb9a0d952716829ec"
      }),
      box: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  }

  calculateFaceLocations = (data) => {
    let aBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');

    const width = Number(image.width);
    const height = Number(image.height);

    return {
      left: aBox.left_col * width,
      right: width - (aBox.right_col * width),
      top: aBox.top_row * height,
      bottom: height - (aBox.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState(Object.assign({}, this.state, {input: event.target.value}))
  }

  onDetectSubmitted = (event) => {
    let targetUrl = this.state.input;
    this.setState(Object.assign({}, this.state, {imageUrl: targetUrl}))
    this.state.clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, 
      targetUrl
      )
      .then((response) => {
        this.displayFaceBox(this.calculateFaceLocations(response));
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} 
                      onDetectSubmitted={this.onDetectSubmitted}/>
        <FaceRecognition imgSrc={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
