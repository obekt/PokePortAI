import type { Express, RequestHandler } from "express";

// Simple authentication with login form for development
export function setupSimpleAuth(app: Express) {
  // Show login form
  app.get("/api/login", (req, res) => {
    const loginForm = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Login - Poke Port AI</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
          button { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background: #2563eb; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Poke Port AI</h1>
          <p>Sign in to manage your Pokemon card portfolio</p>
        </div>
        <form method="POST" action="/api/login">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <button type="submit">Sign In</button>
        </form>
      </body>
      </html>
    `;
    res.send(loginForm);
  });

  // Handle login form submission
  app.post("/api/login", async (req, res) => {
    const { email, name } = req.body;
    const userId = `user-${Date.now()}`;
    
    // Store user in session
    (req as any).session.user = {
      id: userId,
      email: email || "user@example.com",
      firstName: name || "User",
      lastName: "",
      profileImageUrl: null
    };
    
    // Also create user in database for data persistence
    try {
      const { storage } = await import("./storage");
      await storage.upsertUser({
        id: userId,
        email: email || "user@example.com",
        firstName: name || "User",
        lastName: "",
        profileImageUrl: null
      });
    } catch (error) {
      console.log("Note: Could not create user in database:", error);
    }
    
    console.log("Simple auth: user logged in as", email);
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