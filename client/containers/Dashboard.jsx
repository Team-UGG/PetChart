/**
 * ***********************************
 *
 * @module Dashboard
 * @author Austin Ruby and Michael Evans
 * @date 10/12/2019
 * @description stateful component that renders
 * nav bar, home page, and pet profile
 *
 * ***********************************
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions';

import Home from '../components/Home.jsx';
import Nav from '../components/Nav.jsx';
import Profile from '../components/Profile.jsx';

const mapStateToProps = (state) => ({
  userProfile: state.app.userProfile,
  dashboardPage: state.app.dashboardPage,
  activePet: state.app.activePet,
  appPage: state.app.appPage,
});

const mapDispatchToProps = (dispatch) => ({
  changeDBPage: (pageName, activePet) => dispatch(actions.changeDBPage(pageName, activePet)),
  savePet: (petProfile) => dispatch(actions.savePet(petProfile)),
  updatePet: (petProfile) => dispatch(actions.updatePet(petProfile)),
  updateActivePet: (petProfile) => dispatch(actions.updateActivePet(petProfile)),
  addVisitToState: (visitDetails) => dispatch(actions.addVisitToState(visitDetails)),
  addVaccineToState: (vaccineDetails) => dispatch(actions.addVaccineToState(vaccineDetails)),
  addSurgeryToState: (surgeryDetails) => dispatch(actions.addSurgeryToState(surgeryDetails)),
  deletePetFromState: (petID) => dispatch(actions.deletePetFromState(petID)),
  logout: (newPage) => dispatch(actions.logout(newPage)),
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // bind activatePet method
    this.activatePet = this.activatePet.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  activatePet(event) {
    // shorten typing of pets array
    const petsArray = this.props.userProfile.pets;
    // grab pet to activate's id from click event
    const activePetId = Number(event.target.id);
    // iterate through pets array to find clicked pet's details object
    for (let i = 0; i < petsArray.length; i += 1) {
      if (petsArray[i].id === activePetId) {
        // once pet is found, dispatch changeDBPage action with pet's info
        return this.props.changeDBPage('profile', petsArray[i]);
      }
    }
    console.log('pet not found');
    return 'pet not found';
  }

  logoutUser() {
    fetch('/logout')
      .then((response) => {
        this.props.logout("login");
    })
  }

  render() {
    // console.log('Dashboard petNavDetails: ', this.petNavDetails);
    // set default childPage to Home component
    const homeComponent = <Home changeDBPage={this.props.changeDBPage} pets={this.props.userProfile.pets} activatePet={this.activatePet} />;
    let childPage = homeComponent;
    // check if state dashboardPage is home or profile and render corresponding component
    switch (this.props.dashboardPage) {
      case 'home':
        childPage = homeComponent;
        break;
      case 'profile':
        childPage = <Profile
          changeDBPage={this.props.changeDBPage}
          activePet={this.props.activePet}
          savePet={this.props.savePet}
          updatePet={this.props.updatePet}
          updateActivePet={this.props.updateActivePet}
          addVisitToState={this.props.addVisitToState}
          addVaccineToState={this.props.addVaccineToState}
          addSurgeryToState={this.props.addSurgeryToState}
          deletePetFromState={this.props.deletePetFromState}
          ownerID={this.props.userProfile.owner.id} />;
        break;
      default:
        break;
    }
    return (
      // always render Nav component and whatever childPage is set to
      <div className="nav-container">
        <Nav
          logoutUser={this.logoutUser}
          changeDBPage={this.props.changeDBPage}
          activatePet={this.activatePet}
          owner={this.props.userProfile.owner.firstName}
          pets={this.props.userProfile.pets}
        />
        {childPage}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
