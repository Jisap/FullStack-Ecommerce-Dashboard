import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
    publicRoutes: ["/api/:path*"], // No necesitan autentificación
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"], // Necesita autentificación
};