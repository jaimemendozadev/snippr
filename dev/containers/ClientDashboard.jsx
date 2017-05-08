import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import GoogleMaps from '../components/GoogleMaps';
import SnypprList from '../components/SnypprList';
import ReviewsList from '../components/ReviewsList';
import FavoriteList from '../components/FavoriteList';
import Header from '../components/PageElements/Header';
import Footer from '../components/PageElements/Footer';

class ClientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nearbySnypprs: [],
      clientAddress: { lat: props.profile.lat, lng: props.profile.lng },
      favorites: [],
      currentWindow: 'Nearby',
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this.fetchSnypprs(JSON.stringify(this.state.clientAddress));
    this.fetchFavorites();
  }

  fetchSnypprs(address) {
    axios.get(`/nearbySnypprs/${address}`)
      .then((results) => {
        this.setState({ nearbySnypprs: results });
      })
      .catch((err) => {
        console.log('error fucked up ', err);
      });
  }

  fetchFavorites() {
    axios.get(`/favorites/${this.props.profile.id}`)
      .then((favorites) => {
        this.setState({ favorites });
      })
      .catch((err) => {
        console.log('you fucked up fetching your favorites, heres the error ', err);
      });
  }

  handleToggle(event) {
    this.setState({ currentWindow: event.target.value });
  }

  render() {
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div className="dashboard">
        <Header />
        <div className="dashboard-box">
          <div className="navigation">
            <div className="picturebox">
              <img className="userpic" alt="placeholderimage" src="https://timeforgeography.co.uk/static/img/avatar-placeholder.png" />
            </div>
            <div className="navmenu">
              <button
                onClick={this.handleToggle} value="Reviews"
                className="navmenu-items"
              >Reviews</button>
              <button
                onClick={this.handleToggle} value="Nearby"
                className="navmenu-items"
              >Nearby Snypprs</button>
              <button
                onClick={this.handleToggle} value="Favorites"
                className="navmenu-items"
              >Favorites</button>
              <button
                onClick={this.handleToggle} value="Transactions" className="navmenu-items"
              >Transactions</button>
              <button onClick={this.props.logout} className="navmenu-items">Logout</button>
            </div>
          </div>
          <div className="right-box">
            <div className={this.state.currentWindow === 'Reviews' ? 'hidden' : ''}>
              <GoogleMaps
                clientAddress={this.state.clientAddress}
                snypprs={this.state.nearbySnypprs} google={window.google}
              />
            </div>
            <div className={this.state.currentWindow === 'Nearby' ? '' : 'hidden'}>
              <SnypprList snypprs={this.state.nearbySnypprs} />
            </div>
            <div className={this.state.currentWindow === 'Favorites' ? '' : 'hidden'}>
              <FavoriteList
                snypeeId={this.props.profile.id}
                fetchFavorites={this.fetchFavorites} favorites={this.state.favorites}
              />
            </div>
            <div className={this.state.currentWindow === 'Reviews' ? '' : 'hidden'}>
              <ReviewsList reviews={this.props.profile.snypeereviews} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ClientDashboard.propTypes = {
  profile: PropTypes.shape.isRequired,
  logout: PropTypes.func.isRequired,
};

export default ClientDashboard;
