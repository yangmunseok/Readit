export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send({ error: "you need to log in first" });
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    const message = encodeURIComponent("You are already logged in.");
    res.redirect(`/?error=${message}`);
  }
};
