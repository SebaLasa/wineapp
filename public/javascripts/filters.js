'use strict';

angular.module('vinos.filters', []).
  filter('regexReplace', function () {
    return function (input, searchRegex, replaceRegex) {
      return input.replace(RegExp(searchRegex), replaceRegex);
    }
  }).
  filter('dateFormat', function ($filter) {
    var ngDateFilter = $filter('date');
    return function(date) {
       return ngDateFilter(date, 'dd-MM-yyyy');
    }
  }).
  filter('dateTimeFormat', function ($filter) {
    var ngDateFilter = $filter('date');
    return function(date) {
       return ngDateFilter(date, 'dd-MM-yyyy HH:mm');
    }
  }).
  filter('timeFormat', function ($filter) {
    var ngDateFilter = $filter('time');
    return function(time) {
       return ngDateFilter(time, 'HH:mm');
    }
  });
