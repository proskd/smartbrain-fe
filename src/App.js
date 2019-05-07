import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Rank from './components/Rank/Rank.js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';

import {getApiHost} from './config';

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
    id: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
}

const initialState = {
  input: '',
  imageUrl: '',
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

    let id = 0;
    let boxes = regions.map((aRegion) => {
      let aBox = aRegion.region_info.bounding_box;
      return this.calculateFaceLocation(id++, aBox, width, height);
    })

    return boxes;
  }

  calculateFaceLocation = (id, aBox, width, height) => {
    return {
      id: id,
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
    fetch(`${getApiHost(process.env.REACT_APP_SERVER_ENV || 'dev')}/image`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        url: targetUrl
      })
    })
      .then(response => response.json())
      .then((clarifaiResponse) => {
        this.displayFaceBox(this.calculateFaceLocations(clarifaiResponse));
        this.updateUserEntrieSubmitted();
      })
      .catch(error => console.log(error))
  }

  updateUserEntrieSubmitted = () => {
    fetch(`${getApiHost(process.env.REACT_APP_SERVER_ENV || 'dev')}/image`, {
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
        content = <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} getApiHost={getApiHost}/>
        break;
      case 'signin':
      default:
        content = <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} getApiHost={getApiHost}/>
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
