import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  riskAssessment: DS.belongsTo('riskAssessment'),
  handle: DS.attr('string'),
  title: DS.attr('string', { defaultValue: ''}),
  description: DS.attr('string', { defaultValue: ''}),
  efficacy: DS.attr('number'),
  implemented: DS.attr('boolean'),
  planned: Ember.computed.bool('plannedMilestone'),
  plannedMilestone: DS.attr('string'),
  vulnerabilities: DS.hasMany('vulnerability', { embedded: true }),

  status: Ember.computed('implemented', 'planned', function() {
    if(this.get('implemented')) {
      return 'implemented';
    } else if (this.get('planned')) {
      return 'planned';
    } else {
      return 'unimplemented';
    }
  })
});
