import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    this.replaceWith('organization.admin.contact-settings');
  }
});
