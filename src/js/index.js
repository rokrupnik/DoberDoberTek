var libs = require('./libs.js');
var $ = libs.$;
var _ = libs._;
var m = libs.m;

var ingredientsItems = require('./ingredients.js');
var dishIngredientsItems = require('./dishIngredients.js');

// Main object
var app = 
{

    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        //app.display.init();

        //setup routes to start w/ the `#` symbol
        m.route.mode = "hash";

        m.route($("#main")[0], "/", {
            "/": app.input,
            "/zivila": app.ingredients,
            "/jedi": app.dishes,
            "/avtorji": app.credits,
        });
    },
    
    // deviceready Event Handler
    onDeviceReady: function () {
        // First start loading data
        //app.loadData();
    },

    hungerLevel: m.prop('srednje'),
    vv: m.prop(0),
    iv: m.prop(0),
    pp: m.prop(0),

    // input component
    input: {
        // View model
        vm: {
            init: function () {
            },

            selectText: function (e) {
                var inputElement = this;
                setTimeout((function (id) {
                    return function () {
                        $('#' + id).select();
                    };
                })(this.id), 100);
            },

            goToCredits: function () {
                m.route('/avtorji');
            }
        },

        // controller
        controller: function () {
            app.input.vm.init();
        },

        view: function () {
            return m("div.input-container.row", [
                m("div.col-xs-12", [
                    m("h1.text-center.col-xs-12", "Kako lačni ste?"),
                    m("div.padless.col-xs-12", [
                        m("span.padless.col-xs-4", [
                            m("input#malo", {type: "radio", name: "hungerLevel", onchange: m.withAttr("value", app.hungerLevel), value: "malo", checked: app.hungerLevel() === "malo"}, m("small", "Skoraj siti")),
                            m("label.malo.text-center", {for: "malo"}, m("small", "Skoraj siti")),
                        ]),
                        m("span.padless.col-xs-4", [
                            m("input#srednje", {type: "radio", name: "hungerLevel", onchange: m.withAttr("value", app.hungerLevel), value: "srednje", checked: app.hungerLevel() === "srednje"}, m("small", "Nič posebnega")),
                            m("label.srednje.text-center", {for: "srednje"}, m("small", "Nič posebnega")),
                        ]),
                        m("span.padless.col-xs-4", [
                            m("input#zelo", {type: "radio", name: "hungerLevel", onchange: m.withAttr("value", app.hungerLevel), value: "zelo", checked: app.hungerLevel() === "zelo"}, m("small", "Za vola pojest!")),
                            m("label.zelo.text-center", {for: "zelo"}, m("small", "Za vola pojest!"))
                        ]),
                    ]),
                ]),
                m("div.col-xs-12", [
                    m("h1#how-much.col-xs-12.text-center", "Koliko vas je?"),
                    m("span.padless.col-xs-4", [
                        m("span.input-label.text-center.col-xs-12", "VV/BB 11-"),
                        m("input#vv.text-center", {type: "number", onchange: m.withAttr("value", app.vv), onclick: app.input.vm.selectText, value: app.vv()}),
                    ]),
                    m("span.padless.col-xs-4", [
                        m("span.input-label.text-center.col-xs-12", "IV 11-15"),
                        m("input#iv.text-center", {type: "number", onchange: m.withAttr("value", app.iv), onclick: app.input.vm.selectText, value: app.iv()}),
                    ]),
                    m("span.padless.col-xs-4", [
                        m("span.input-label.text-center.col-xs-12", "PP/SKVO 16+"),
                        m("input#pp.text-center", {type: "number", onchange: m.withAttr("value", app.pp), onclick: app.input.vm.selectText, value: app.pp()})
                    ]),
                ]),
                m("div.col-xs-12", [
                    m("span#ingredients.link.text-center.col-xs-4 col-xs-offset-1", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/zivila"}, "ŽIVILA"),
                    m("span#dishes.link.text-center.col-xs-4 col-xs-offset-2", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/jedi"}, "JEDI")
                ]),
                m("a.text-center.col-xs-12", {href: "https://docs.google.com/forms/d/1v5eekn6bUch71Ct5GZ_1H-Up9p1HssnqPdoDeAGlfCc/viewform?c=0&w=1", target: "_blank"}, "ODDAJ PREDLOG ZA IZBOLJŠAVO"),
                m("span.about-link.text-center.col-xs-12", {onclick: app.input.vm.goToCredits}, "O APLIKACIJI"),
                // m("div.col-xs-3.text-center", app.hungerLevel()), 
                // m("div.col-xs-3.text-center", app.vv()), 
                // m("div.col-xs-3.text-center", app.iv()), 
                // m("div.col-xs-3.text-center", app.pp()),
            ]);
        },
    },

    // ingredients component
    ingredients: {
        // View model
        vm: {
            init: function() {
            },

            filter: function () {
                var searchValue = $("#search-ingredients").val().toLowerCase();
                ingredientsItems = ingredientsItems.map(function (ingredient) {
                    ingredient.visible = _.includes(ingredient.title.toLowerCase(), searchValue);
                    return ingredient;
                });
                m.redraw();
            }
        },

        // controller
        controller: function () {
            app.ingredients.vm.init();
        },

        view: function() {
            return m("div.row", [
                // m("button.btn.btn-primary.col-xs-4 col-xs-offset-4", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/"}, "NAZAJ"),
                m("div.search-container", [
                    m("strong.col-xs-12.text-center", "ISKANJE"),
                    m("input#search-ingredients.col-xs-12", {type: "text", onkeyup: app.ingredients.vm.filter})
                ]),
                m("div.list-container", _.filter(ingredientsItems, 'visible').map(function (ingredient) {
                    return m("div.list-item.thumbnail.col-xs-12", [
                        m("div.col-xs-6", ingredient.title),
                        m("div.col-xs-3", app.utils.calculateQuantity(ingredient)),
                        m("div.col-xs-3.text-center", ingredient.unit),
                    ]);
                })),
                // m("button.btn.btn-primary.col-xs-4 col-xs-offset-4", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/"}, "NAZAJ")
            ]);
        },
    },

    // dishes component
    dishes: {
        // View model
        vm: {
            init: function () {
            },

            filter: function () {
                var searchValue = $("#search-dishes").val().toLowerCase();
                dishIngredientsItems = dishIngredientsItems.map(function (ingredient) {
                    ingredient.visible = _.includes(ingredient.dish.toLowerCase(), searchValue) || _.includes(ingredient.title.toLowerCase(), searchValue);
                    return ingredient;
                });
                m.redraw();
            }
        },

        // controller
        controller: function () {
            app.dishes.vm.init();
        },

        view: function() {
            return m("div.row", [
                // m("button.btn.btn-primary.col-xs-4 col-xs-offset-4", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/"}, "NAZAJ"),
                m("div.search-container", [
                    m("strong.col-xs-12.text-center", "ISKANJE"),
                    m("input#search-dishes.col-xs-12", {type: "text", onkeyup: app.dishes.vm.filter})
                ]),
                m("div.list-container", _.filter(_.sortBy(_.values(_.groupBy(dishIngredientsItems, 'dish')), '[0].dish'), function (dishIngredients) {
                        // Display dish if at least one ingredient is visible
                        return _.some(dishIngredients, 'visible');
                    }).map(function (dishIngredients) {
                        return m("div.list-item.thumbnail.col-xs-12", 
                            [m("strong.col-xs-12", dishIngredients[0].dish),]
                            .concat(dishIngredients.map(function (ingredient) {
                                return m("div.col-xs-12", [
                                    m("hr.dish-ingredient"),
                                    m("div.col-xs-6", ingredient.title),
                                    m("div.col-xs-3", app.utils.calculateQuantity(ingredient)),
                                    m("div.col-xs-3.text-center", ingredient.unit),
                                ]);
                            })));
                })),
                // m("button.btn.btn-primary.col-xs-4 col-xs-offset-4", {onclick: m.withAttr("value", app.utils.changeRoute), value: "/"}, "NAZAJ")
            ]);
        },
    },

    // credits component
    credits: {
        // View model
        vm: {
            init: function () {
            },
        },

        // controller
        controller: function () {
            app.credits.vm.init();
        },

        view: function() {
            return m("div.about-container.row", [
                m("h2", "O aplikaciji"),
                m("p", "Aplikacija je bila razvita s strani skavtskih voditeljev, ki delujejo v Združenju slovenskih katoliških skavtinj in skavtov. Aplikacija je rezultat projekta 'Zdrava prehrana na skavtskih aktivnostih', ki deluje v okviru projekta 'Za zdravje mladih'."),
                m("h2", "Člani projekta 'Zdrava prehrana na skavtskih aktivnostih':"),
                m("ul", [
                    m("li", m("a", {href: "mailto:brezovniks@gmail.com"}, "Simon Brezovnik")),
                    m("li", m("a", {href: "mailto:jagodic.ana153@gmail.com"}, "Ana Jagodic")),
                    m("li", m("a", {href: "mailto:eva.lovsin10@gmail.com"}, "Eva Lovšin")),
                    m("li", m("a", {href: "mailto:sara.marinko@gmail.com"}, "Sara Marinko")),
                ]),
                m("h2", "Programer:"),
                m("ul", [
                    m("li", m("a", {href: "http://rokrupnik.github.io/", target: "_blank"}, "Rok Rupnik")),
                ]),
                m("h2", "Oblikovalec:"),
                m("ul", [
                    m("li", m("a", {href: "http://www.viki.si/", target: "_blank"}, "Viktor Höchtl")),
                ]),
                m("h2", "Avtor faktorjev za preračunavanje:"),
                m("ul", [
                    m("li", m("a", {href: "http://moj.skavt.net/ttomsic/", target: "_blank"}, "Tomi Tomšič")),
                ]),
                // m("a.text-center.col-xs-12", {href: "/#/"}, "NAZAJ")
            ]);
        },
    },

    utils: {
        changeRoute: function (route) {
            m.route(route);
        },
        calculateQuantity: function (ingredient) {
            var hL = app.hungerLevel().toLowerCase(),
                vv = app.vv();
                iv = app.iv();
                pp = app.pp(),
                quantity = ingredient.vv[hL] * vv + ingredient.iv[hL] * iv + ingredient.pp[hL] * pp;

                // Round to 2 decimals
                quantity = Math.round(quantity * 100) / 100;

                // Round up if unit is undivisible
                if (_.includes(["kos", "strok", "žlička"], ingredient.unit)) {
                    quantity = Math.ceil(quantity);
                }

                // Return a number only if its greater than zero
                // This is done because we have some ingredients that are voluntary like spices
                // and they are in very small quantities
                return quantity > 0 ? quantity : "";
        }
    }
};

// "main()"
app.initialize();
