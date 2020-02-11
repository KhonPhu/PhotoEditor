"use strict";
var fs = require('fs');


module.exports = {
	name: "greeter",

	/**
	 * Service settings
	 */
	settings: {

		validUserList: {}

	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		validate: {
			params: {
				username: "string",
				password: "string"
			},
			handler(ctx) {
				return this.validateUser(ctx);
			}
		}


	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {


		// private funtions are delcared here
		validateUser(ctx) {
			let THIS = this;
			return new Promise(function (resolve) {
				// Validate from the Pre-loaded users
				if (THIS.settings.validUserList.hasOwnProperty(ctx.params.username)) {
					let password = THIS.settings.validUserList[ctx.params.username];
					password == ctx.params.password ? resolve({ valid: true }) : resolve({ valid: false });
				} else {
					resolve({ valid: false })
				}
			});
		}


	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

		
		this.settings.validUserList = JSON.parse(fs.readFileSync('./user.json', 'utf8'));

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};