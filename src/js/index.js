var libs = require('./libs.js');
var $ = libs.$;
var _ = libs._;
var m = libs.m;

var ingredientsItems = require('./ingredients.js');

// Main object
var app = 
{

    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        //app.display.init();

        //setup routes to start w/ the `#` symbol
        m.route.mode = "hash";

        m.route(document.body, "/", {
            "/": app.input,
            "/zivila": app.ingredients,
        });
    },
    
    // deviceready Event Handler
    onDeviceReady: function () {
        // First start loading data
        //app.loadData();
    },

    hungerLevel: m.prop(''),
    vv: m.prop(''),
    iv: m.prop(''),
    pp: m.prop(''),

    hungerFactors: {
        malo: {
            vv: 1.0,
            iv: 1.05,
            pp: 1.1,
        },
        srednje: {
            vv: 1.05,
            iv: 1.1,
            pp: 1.15,
        },
        zelo: {
            vv: 1.1,
            iv: 1.15,
            pp: 1.2,
        },
    },

    // input component
    input: {
        // View model
        vm: {
            init: function() {
            },
            changeRoute: function (route) {
                m.route(route);
            }
        },

        // controller
        controller: function () {
            app.input.vm.init();
        },

        view: function() {
            return m("div.row", [
                m("div.form-group", [
                    m("label.col-xs-12.text-center", "Kako lačni boste?"),
                    m("button.btn.btn-primary.col-xs-4", {onclick: m.withAttr("value", app.hungerLevel), value: "MALO"}, "Mal mi krul"),
                    m("button.btn.btn-primary.col-xs-4", {onclick: m.withAttr("value", app.hungerLevel), value: "SREDNJE"}, "Nič posebnega"),
                    m("button.btn.btn-primary.col-xs-4", {onclick: m.withAttr("value", app.hungerLevel), value: "ZELO"}, "Za vola pojest!")
                ]),
                m("div.form-group", [
                    m("label.col-xs-12.text-center", "Koliko vas je?"),
                    m("span.text-center.col-xs-4", "VV/BB 11-"),
                    m("span.text-center.col-xs-4", "IV 11-15"),
                    m("span.text-center.col-xs-4", "PP/SKVO 16+"),
                    m("input.col-xs-4", {type: "number", onchange: m.withAttr("value", app.vv)}),
                    m("input.col-xs-4", {type: "number", onchange: m.withAttr("value", app.iv)}),
                    m("input.col-xs-4", {type: "number", onchange: m.withAttr("value", app.pp)})
                ]),
                m("div.form-group", [
                    m("button.btn.btn-primary.col-xs-4", {onclick: m.withAttr("value", app.input.vm.changeRoute), value: "/zivila"}, "ŽIVILA"),
                    m("button.btn.btn-primary.col-xs-4 col-xs-offset-4", {onclick: m.withAttr("value", app.input.vm.changeRoute), value: "/jedi"}, "JEDI")
                ]),
                m("div.col-xs-3.text-center", app.hungerLevel()), 
                m("div.col-xs-3.text-center", app.vv()), 
                m("div.col-xs-3.text-center", app.iv()), 
                m("div.col-xs-3.text-center", app.pp()),
            ]);
        },
    },

    // ingredients component
    ingredients: {
        // View model
        vm: {
            init: function() {
            },
            calculateQuantity: function (ingredient) {
                var hL = app.hungerLevel().toLowerCase(),
                    vv = app.vv() * 1.0;
                    iv = app.iv() * 1.0;
                    pp = app.pp() * 1.0,
                    f = ingredient.factor;

                return app.hungerFactors[hL].vv * vv * f + app.hungerFactors[hL].iv * iv * f + app.hungerFactors[hL].pp * pp * f;
            }
        },

        // controller
        controller: function () {
            app.ingredients.vm.init();
        },

        view: function() {
            return m("div.row", [
                m("div.col-xs-12", [
                    m("div.col-xs-3.text-center", app.hungerLevel()),
                    m("div.col-xs-3.text-center", app.vv()), 
                    m("div.col-xs-3.text-center", app.iv()), 
                    m("div.col-xs-3.text-center", app.pp()),
                ]),
                m("div.col-xs-12", ingredientsItems.map(function (ingredient) {
                    return [
                        m("div.col-xs-6.text-center", ingredient.title),
                        m("div.col-xs-3.text-center", app.ingredients.vm.calculateQuantity(ingredient)),
                        m("div.col-xs-3.text-center", ingredient.unit),
                    ];
                })),
            ]);
        },
    },
};

// "main()"
app.initialize();
