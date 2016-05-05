import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'my-stack-1';
let url = `/stacks/${stackId}/databases`;

module('Acceptance: Databases', {
  beforeEach: function() {
    App = startApp();
    let stack = {
      id: stackId,
      handle: 'my-stack-1',
      _links: {
        databases: { href: '/accounts/my-stack-1/databases' },
        permissions: { href: '/accounts/my-stack-1/permissions' },
        organization: { href: '/organizations/1' },
      }
    };
    stubStack(stack);
    stubStacks({includeDatabases:true}, [stack]);
    stubOrganization();
    stubOrganizations();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /stacks/:stack_id/databases requires authentication', function() {
  expectRequiresAuthentication('/stacks/my-stack-1/databases');
});

test('visiting /stacks/:stack_id/databases', function(assert) {
  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.requires-read-access.stack.databases.index');
    expectTitle('my-stack-1 Databases');
  });
});

test('visiting /stacks/my-stack-1/databases shows list of databases', function(assert) {
  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function() {
    var row = findWithAssert('.panel.database');
    assert.equal(row.length, 2, 'shows 2 databases');
  });
});

test('visiting /stacks/my-stack-1/databases then clicking on an database visits the database', function(assert) {
  stubRequest('get', '/databases/1/operations', function(){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function(){
    var dbLink = find('a[href~="/databases/1"]');
    assert.ok(dbLink.length, 'has link to database');

    click(dbLink);
  });

  andThen(function(){
    assert.equal(currentPath(), 'dashboard.requires-read-access.database.activity', 'show page is visited');
  });
});

test(`visiting ${url} when user is verified shows Create Database button`, function() {
  let userData = {verified: true};
  signInAndVisit(url, userData);
  andThen( () => {
    expectButton('Create Database');
  });
});

test(`visiting ${url} when user is not verified shows no Create Database button`, function() {
  let userData = {verified: false};
  signInAndVisit(url, userData);
  andThen( () => {
    expectNoButton('Create Database');
  });
});
