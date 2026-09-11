import { Router } from "express";
export function createProblemRouter(problemService) {
    const router = Router();
    router.get("/", async (_request, response, next) => {
        try {
            const problems = await problemService.listProblems();
            response.json({
                success: true,
                count: problems.length,
                data: problems,
            });
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/:slug", async (request, response, next) => {
        try {
            const problem = await problemService.getProblem(String(request.params.slug));
            response.json({
                success: true,
                data: problem,
            });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
