/**
 * Kettle Initialisation Tests
 *
 * Copyright 2013 OCAD University
 * Copyright 2012-2015 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/fluid-project/kettle/blob/master/LICENSE.txt
 */
 
"use strict";

var fluid = require("infusion"),
    kettle = require("../kettle.js"),
    jqUnit = fluid.require("node-jqunit", null, "jqUnit");
    
    
fluid.defaults("kettle.tests.init.server", {
    gradeNames: ["kettle.server"],
    members: {
        fireRecord: []
    },
    listeners: {
        onListen: {
            priority: "last",
            funcName: "kettle.tests.init.assertAndCleanup",
            args: "{that}"
        },
        onContributeMiddleware: {
            funcName: "kettle.tests.init.record",
            args: ["{that}", "onContributeMiddleware"]
        },
        onContributeRouteHandlers: {
            funcName: "kettle.tests.init.record",
            args: ["{that}", "onContributeRouteHandlers"]
        },
        onCreate: {
            priority: "first",
            funcName: "kettle.tests.init.record",
            args: ["{that}", "onCreate"]
        }
    }
});

kettle.tests.init.record = function (that, name) {
    that.fireRecord.push(name);
};

kettle.tests.init.assertAndCleanup = function (that) {
    jqUnit.assertDeepEq("Expected init event sequence", ["onCreate", "onContributeMiddleware", "onContributeRouteHandlers"], that.fireRecord);
    that.stop();
    jqUnit.start();
};

jqUnit.asyncTest("Kettle server initialisation test", function () {
    jqUnit.expect(1);
  
    kettle.tests.init.server({});
});