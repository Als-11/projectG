(function(angular, undefined) {
  angular.module("guwhaApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin",
		"SERVICE_PROVIDER",
		"EMPLOYEE",
		"RESIDENT",
		"GUWHA_EMPLOYEE",
		"COMMUNITY_ADMIN",
		"SUPER_ADMIN"
	]
})

;
})(angular);