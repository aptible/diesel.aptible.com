import {
  moduleForModel,
  test
} from 'ember-qunit';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('threat-event', 'model:threat-event', {
  needs: modelDeps
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
