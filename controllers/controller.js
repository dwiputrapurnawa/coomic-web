const homePageView = (req, res) => {
    res.render("home");
};

const loginPageView = (req, res) => {
    res.render("login");
}

module.exports = {
    homePageView,
    loginPageView,
}