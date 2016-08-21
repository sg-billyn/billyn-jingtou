'use strict';

class NavbarController {
  //start-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.currentUser = Auth.getCurrentUser();
  }
}

angular.module('billynApp')
  .controller('NavbarController', NavbarController);
