import type { Express, RequestHandler } from "express";

// Simple authentication bypass for development
export function setupSimpleAuth(app: Express) {
  // Simple login route that sets a basic session
  app.get("/api/login", (req, res) => {
    // For now, create a simple mock user session
    (req as any).session.user = {
      id: "test-user-123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: null
    };
    
    console.log("Simple auth: user logged in");
    res.redirect("/");
  });

  // Simple logout route
  app.get("/api/logout", (req, res) => {
    (req as any).session.destroy();
    res.redirect("/");
  });

  // Auth check route
  app.get('/api/auth/user', (req: any, res) => {
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
}

// Simple authentication middleware
export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.user) {
    req.user = { claims: { sub: req.session.user.id } };
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};