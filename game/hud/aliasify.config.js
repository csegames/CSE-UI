var path = require("path");
module.exports = {
    replacements: {
        "^UI/(\\w+)": ".\\tmpp\\components\\UI\\$1",
        "^actions/(\\w+)": ".\\tmpp\\services\\actions\\$1",
        "^lib/(\\w+)": ".\\tmpp\\lib\\$1",
        "^services/(\\w+)": ".\\tmpp\\services\\$1",
        "^actions/(\\w+)": ".\\tmpp\\services\\actions\\$1",
        "^widgets/(\\w+)": ".\\tmpp\\widgets\\$1",
        "^components/(\\w+)": ".\\tmpp\\components\\$1",
    },
    verbose: false
};
