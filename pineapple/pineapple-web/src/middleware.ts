import { authMiddleware } from "@clerk/nextjs";

// Define the routes that you want to bypass authentication for
const ignoredRoutes = [
  "/api/add-user", // Add any other routes you want to bypass here
  "/api/get-user" // Add any other routes you want to bypass here
];

// Configure the authMiddleware to ignore specified routes
export default authMiddleware({
  ignoredRoutes: ignoredRoutes,
});

// Export additional configuration if needed
export const config = {
  // Define your matcher configuration
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
