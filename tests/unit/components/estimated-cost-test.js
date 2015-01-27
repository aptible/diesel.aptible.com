import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('estimated-cost', 'EstimatedCostComponent', {});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    count: 5,
    stack: Ember.Object.create({
      appContainerCentsPerHour: 10,
      type: 'production'
    })
  });

  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('calculates accurate estimate', function() {
  expect(4);

  var component = this.subject({
    count: 5,
    stack: Ember.Object.create({
      appContainerCentsPerHour: 10,
      type: 'production'
    })
  });

  equal(component.get('rateInDollars'), '$0.10');
  equal(component.get('unitOfMeasure'), 'Production App Containers');
  equal(component.get('total'), '$365.50');
  equal(component.centsToDollars(91230), '$912.30');
});