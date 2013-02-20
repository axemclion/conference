window.CONF = {
	remote: {
		sessions: "http://localhost:2020/sessions",
		userprefs: "http://localhost:2020/userprefs",
	},

	/*remote: {
		sessions: "http://axe-corsproxy.herokuapp.com/sessions",
		userprefs: "http://axe-corsproxy.herokuapp.com/userprefs"
	},*/

	local: {
		sessions: "idb://sessions",
		userprefs: "idb://userprefs",
	}
}
