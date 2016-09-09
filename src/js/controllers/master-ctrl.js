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
    $scope.pr_name = "";
    $scope.pr_type = 1;
    $scope.client = "";
    $scope.st_date = "";
    $scope.bg = 0;
    $scope.hrate = 0;
    $scope.currency = "USD";
    $scope.p_link = "";
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
        $scope.calOverall();
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
            if(resp.data.msg != 'error'){
                $scope.pr_list = JSON.parse(resp.data)
                $scope.calOverall();
            }
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
                if(resp.data.msg != 'error'){
                    $scope.pr_list = JSON.parse(resp.data);
                    $scope.calOverall();
                }
            },function(error){
                console.log(error);
            });
    }
    $scope.createProject = function(){
        if(confirm("Do you wanna create project?"))
        {
            console.log($scope.pr_type);
            psw = prompt("Please insert password");
            $http({
                method : 'POST',
                url : 'http://127.0.0.1:5000/createProject',
                data : {'psw':psw, 'p_name': $scope.pr_name, 'p_type': $scope.$scope.pr_type, 'clt': $scope.client, 'st_date': $scope.st_date, 'bg': $scope.bg, 'h_rate': $scope.hrate, 'currency': $scope.currency,'p_link':$scope.p_link}
            })
            .then(function(resp){
                console.log(resp.data)
                if(resp.data.msg != 'error'){
                    $scope.pr_list = JSON.parse(resp.data)
                    $scope.calOverall();
                    $scope.pr_name = "";
                    $scope.pr_type = 1;
                    $scope.client = "";
                    $scope.st_date = "";
                    $scope.bg = 0;
                    $scope.hrate = 0;
                    $scope.currency = "USD";
                    $scope.p_link = "";
                }
            },function(error){
                console.log(error);
            });
        }
    }
    $scope.calOverall = function(){
        t_rating = 0;
        t_f_earning = 0;
        t_h_earning = 0;
        t_h_hour = 0;
        t_earning = 0;
        for(i=0;i<$scope.pr_list.length;i++){
            if($scope.pr_list[i].project_type==1){
                t_rating += parseInt($scope.pr_list[i].rate * $scope.pr_list[i].price);
                t_f_earning += parseInt($scope.pr_list[i].price);
            }else{
                t_rating += parseInt($scope.pr_list[i].rate * $scope.pr_list[i].hourly_rate * $scope.pr_list[i].work_hour);
                t_h_earning += parseInt($scope.pr_list[i].hourly_rate * $scope.pr_list[i].work_hour);
                t_h_hour += parseInt($scope.pr_list[i].work_hour);
            }
        }
        $scope.overall_earning = t_h_earning + t_f_earning;
        $scope.fixed_earning = t_f_earning;
        $scope.hourly_earning = t_h_earning;
        $scope.overall_rate = t_rating / (t_h_earning + t_f_earning);
        $scope.overall_h_rate = t_h_earning / t_h_hour;
        $scope.overall_w_hour = t_h_hour;
    }
}