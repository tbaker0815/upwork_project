/**
 * Widget Body Directive
 */

angular
    .module('RDash')
    .directive('rdProjectList', rdProjectList);

function rdProjectList() {
    var directive = {
        requires: '^rdProjectList',
        scope : false,
        transclude: true,
        templateUrl: 'templates/widget/project-list.html',
        restrict: 'EA'
    };
    return directive;  
};