import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';

moduleForModel('app', 'model:app', {
  needs: modelDeps.concat([
    'adapter:app',
    'adapter:operation' // for 'operation', to avoid getting the fixture adapter
  ])
});

test('finding uses correct url', function(assert){
  let done = assert.async();
  assert.expect(2);

  let appId = 'my-app-id';

  stubRequest('get', `/apps/${appId}`, function(){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: appId,
      handle: 'my-cool-app',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  let store = this.store();

  return Ember.run(function(){
    return store.find('app', appId).then(function(){
      assert.ok(true, 'app did find');
    }).finally(done);
  });
});

test('reloading app with stack uses correct url', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();

  let app = Ember.run(store, 'push', 'app', {id:'app1'});
  let stack = Ember.run(store, 'push', 'stack', {id:'stack1'});

  stubRequest('get', `/apps/app1`, function(){
    assert.ok(true, 'gets correct url');
    return this.success({id:'app1'});
  });

  Ember.run(() => {
    app.set('stack', stack);
    app.reload().finally(done);
  });
});

test('creating POSTs to correct url', function(assert) {
  assert.expect(2);

  var store = this.store();
  var app, stack;
  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    app = store.createRecord('app', {handle:'my-cool-app', stack:stack});
  });

  stubRequest('post', '/accounts/1/apps', function(){
    assert.ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-app-id',
      handle: 'my-cool-app'
    });
  });

  return Ember.run(function(){
    return app.save().then(function(){
      assert.ok(true, 'app did save');
    });
  });
});

test('#isDeprovisioned', function(assert) {
  var app = this.subject();

  assert.ok(!app.get('isDeprovisioned'));

  Ember.run(function(){
    app.set('status', 'deprovisioned');
  });

  assert.ok(app.get('isDeprovisioned'));
});

test('embedded lastDeployOperation is sideloaded', function(assert) {
  assert.expect(4);

  var store = this.store();
  var appId = '1',
      opId = 'last-deploy-op';

  stubRequest('get', '/apps/:app_id', function(){
    assert.ok(true, 'gets app by id');
    return this.success({
      id: appId,
      _embedded: {
        last_deploy_operation: {
          id: opId
        }
      }
    });
  });

  return Ember.run(function(){
    return store.find('app', 1).then(function(app){
      assert.ok(app, 'gets app');

      return app.get('lastDeployOperation');
    }).then(function(op){
      assert.ok(op, 'gets op');
      assert.equal(op.get('id'), opId);
    });
  });
});

test('embedded currentImage is sideloaded', function(assert) {
  assert.expect(4);

  var store = this.store();
  var appId = '1',
      imageId = 'image-id';

  stubRequest('get', '/apps/:app_id', function(){
    assert.ok(true, 'gets app by id');
    return this.success({
      id: appId,
      _embedded: {
        current_image: {
          id: imageId
        }
      }
    });
  });

  return Ember.run(function(){
    return store.find('app', 1).then(function(app){
      assert.ok(app, 'gets app');

      return app.get('currentImage');
    }).then(function(image){
      assert.ok(image, 'gets image');
      assert.equal(image.get('id'), imageId);
    });
  });
});
