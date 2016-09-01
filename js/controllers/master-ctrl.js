/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$location', '$http', MasterCtrl]);
function MasterCtrl($scope, $cookieStore, $location, $http) {

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }
    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
    
    $http({
        url:'http://127.0.0.1:5000/getProjects'
    })
    .then(function(resp){
        projects = JSON.parse(resp.data)
        $scope.pr_list = projects;
    },function(error){
    });

    $scope.add_hour = function(pr_id, w_h){
        hour = prompt("Please insert hours to add");
        psw = prompt("Please insert password");
        $http({
            method : 'POST',
            url : 'http://127.0.0.1:5000/addHour',
            data : {'pr_id': pr_id, 'w_h': w_h, 'a_h': hour, 'psw': psw}
        })
        .then(function(resp){
            if(resp.data.msg != 'error')
                $scope.pr_list = JSON.parse(resp.data)
        },function(error){
            console.log(error);
        });
    }
    $scope.finish_project = function(pr_id){
        if(confirm("Do you wanna finish the project?"))
            rate = prompt("Please insert Rate")
            comment = prompt("Please insert Comment")
            ed_date = prompt("Please insert Ending Date")
            psw = prompt("Please insert password")
            $http({
                method : 'POST',
                url : 'http://127.0.0.1:5000/finishProject',
                data : {'pr_id': pr_id, 'psw': psw, 'rate':rate, 'comment': comment, 'ed_date': ed_date}
            })
            .then(function(resp){
                if(resp.data.msg != 'error')
                    $scope.pr_list = JSON.parse(resp.data)
            },function(error){
                console.log(error);
            });
    }
    $scope.createProject = function(){
        if(confirm("Do you wanna create project?"))
        {
            psw = prompt("Please insert password");
            pr_name = $("#pr_name_holder").val();
            pr_type = $("#pr_type_holder").val();
            client = $("#client_holder").val();
            st_date = $("#st_date_holder").val();
            bg = $("#budget_holder").val();
            hrate = $("#h_rate_holder").val();
            currency = $("#currency_holder").val();
            p_link = $("#pr_link_holder").val();
            $http({
                method : 'POST',
                url : 'http://127.0.0.1:5000/createProject',
                data : {'psw':psw, 'p_name': pr_name, 'p_type': pr_type, 'clt': client, 'st_date': st_date, 'bg': bg, 'h_rate': hrate, 'currency': currency,'p_link':p_link}
            })
            .then(function(resp){
                console.log(resp.data)
                if(resp.data.msg != 'error')
                    $scope.pr_list = JSON.parse(resp.data)
            },function(error){
                console.log(error);
            });
        }
    }
}