import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Rank from './components/Rank/Rank.js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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

const defaultBox = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
}

const initialState = {
  input: '',
  imageUrl: '',
  clarifaiApp: new Clarifai.App({
    apiKey: "86b450683ca541aeb9a0d952716829ec"
  }),
  boxes: [defaultBox],
  route: 'signin',
  isSignedIn: false,
  user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: new Date()
  }
}

class App extends Component {

  constructor() {
    super()
    this.state = initialState;
  }

  calculateFaceLocations = (data) => {
    const image = document.getElementById('inputimage');

    const width = Number(image.width);
    const height = Number(image.height);

    let regions = data.outputs[0].data.regions;

    let boxes = regions.map((aRegion) => {
      let aBox = aRegion.region_info.bounding_box;
      return this.calculateFaceLocation(aBox, width, height);
    })

    return boxes;
  }

  calculateFaceLocation = (aBox, width, height) => {
    return {
      left: aBox.left_col * width,
      right: width - (aBox.right_col * width),
      top: aBox.top_row * height,
      bottom: height - (aBox.bottom_row * height)
    };
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes})
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
        this.updateUserEntrieSubmitted();
      })
      .catch(error => console.log(error))
  }

  updateUserEntrieSubmitted = () => {
    fetch("http://localhost:3001/image", {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id: this.state.user.id
      })
    }).then(res => res.json())
    .then((count) => {
      this.setState(Object.assign(this.state.user, {entries: count}))
    }).catch(error => console.log(error));
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  onRouteChange = (route) => {
    this.setState({route: route})
    if (route === 'home') {
      this.setState({isSignedIn: true})
    } else if (route === 'signin') {
      this.setState(initialState)
    }
  }

  homePage = () => {
    return (
      <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} 
                      onDetectSubmitted={this.onDetectSubmitted}/>
        <FaceRecognition imgSrc={this.state.imageUrl} boxes={this.state.boxes}/>
      </div> 
    )
  }

  render() {

    var content;

    switch(this.state.route) {
      case 'home':
        content = this.homePage()
        break;
      case 'register':
        content = <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        break;
      case 'signin':
      default:
        content = <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
    }

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {
          content
        }
        
      </div>
    );
  }
}

export default App;
