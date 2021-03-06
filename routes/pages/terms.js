const Mustache = require("mustache");
const async = require("async");

const {View} = require("../../app/view");
const Config = require("../../app/config");

module.exports = (req, res, next) => {

    async.parallel({
        layout: (cb) => {
            View.getView(View.MAIN_LAYOUT, cb);
        },
        header: (cb) => {
            View.getView(View.HEADER, cb);
        },
        footer: (cb) => {
            View.getView(View.FOOTER, cb);
        },
        content: (cb) => {
            View.getView(View.TERMS, cb);
        }
    }, (err, results) => {

        if(err){
            const errObj = {code: 404, mes: Config.ER_PNF};
            next(errObj);
        } else {
            const page = Mustache.render(results.layout, {title: "Terms"},
                {
                    header: results.header,
                    footer: results.footer,
                    content: results.content
                });

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(page);
        }
    });
};