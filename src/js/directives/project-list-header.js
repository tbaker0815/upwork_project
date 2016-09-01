/**
 * Widget Body Directive
 */

angular
    .module('RDash')
    .directive('rdProjectListHeader', rdProjectListHeader);

function rdProjectListHeader() {
    var directive = {
        requires: '^rdProjectList',
        scope: {
            loading: '@?',
            classes: '@?'
        },
        transclude: true,
        template: '<table class="table table-bordered"><tr><th>Project Name</th><th>Client</th><th>Budget</th><th>Start Date</th><th>End Date</th><th>Rate</th><th>Comment</th></tr><tbody id="pr_list_holder">',
        restrict: 'E'
    };
    return directive;
    
};