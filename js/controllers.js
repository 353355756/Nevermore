angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, NWService, ServerService, DataService) {
  var win = NWService.win;

  $scope.servers = DataService.getServers();
  $scope.setting = DataService.getSetting();
  $scope.selected = DataService.getSelected();
  $scope.current = $scope.servers[$scope.selected];
  $scope.methods = DataService.methods;
  $scope.running = DataService.getRunning();
  
  $scope.debug = function () {
    win.showDevTools();
  }
  $scope.close = function () {
    win.hide();
  }
  var current;
  $scope.edit = function () {
    $scope.editing = true;
  }
  $scope.save = function () {
    var server = $scope.current;
    if(server.name && server.ip && server.port && server.password && server.method) {
      $scope.editing = false;
      DataService.setServers($scope.servers);
      DataService.setSetting($scope.setting);
    }
  }
  $scope.cancel = function () {
    $scope.editing = false;
    $scope.selected = DataService.getSelected();
    $scope.current = DataService.getCurrent();
    $scope.servers = DataService.getServers();
    $scope.setting = DataService.getSetting();  
  }

  $scope.start = function () {
    var config = {
      localport: $scope.setting.localport,
      timeout: $scope.setting.timeout
    }
    angular.extend(config,$scope.current);
    ServerService.start(config);
    $scope.running = true;
    DataService.setSelected($scope.selected);
    DataService.setRunning($scope.running);
  }
  $scope.stop = function () {
    ServerService.stop();
    $scope.running = false;
    DataService.setRunning($scope.running);
  }

  $scope.method = function () {
    console.log($scope.current.method);
  }

  $scope.editing = false;
  $scope.expanded = false;
  $scope.expand = function () {
    var width = 500;
    if($scope.expanded)  width = 300;
    $scope.expanded = !($scope.expanded);
    return win.resizeTo(width,400);
  }
  $scope.select = function (idx) {
    $scope.selected = idx;
    $scope.current = $scope.servers[idx];
  }
  $scope.add = function () {
    $scope.editing = true;
    var server = {
      name: 'Server ' + $scope.servers.length,
      method: $scope.methods[0].value
    }
    $scope.servers.push(server);
    $scope.selected = $scope.servers.length-1;
    $scope.current = $scope.servers[$scope.selected];
  }
  $scope.delete = function () {
    $scope.editing = false;
    $scope.servers.splice($scope.selected,1);
    var idx = $scope.selected -1;
    if(idx<0) idx = 0;
    $scope.selected = idx;
    $scope.current = $scope.servers[idx];
    DataService.setServers($scope.servers);
  }
  $scope.feedback = function () {
    var link = 'http://liteneo.com';
    NWService.openLink(link);
  }
  if($scope.running)  $scope.start();
})
