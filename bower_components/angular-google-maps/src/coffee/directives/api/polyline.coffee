angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolyline', [
  'uiGmapIPolyline', '$timeout', 'uiGmaparray-sync', 'uiGmapPolylineChildModel',
  (IPolyline, $timeout, arraySync, PolylineChildModel) ->
    class Polyline extends IPolyline
      link: (scope, element, attrs, mapCtrl) =>
        # Validate required properties
        if angular.isUndefined(scope.path) or scope.path is null or not @validatePath(scope.path)
          @$log.error 'polyline: no valid path attribute found'
          return

        # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
        IPolyline.mapPromise(scope, mapCtrl).then (map) =>
          new PolylineChildModel scope, attrs, map, @DEFAULTS
]
