export class ProblemService {
    problemRepository;
    constructor(problemRepository) {
        this.problemRepository = problemRepository;
    }
    async listProblems() {
        return this.problemRepository.findAll();
    }
    async getProblem(slug) {
        const problem = await this.problemRepository.findBySlug(slug);
        if (!problem) {
            const error = new Error(`Problem '${slug}' was not found`);
            error.name = "NotFoundError";
            throw error;
        }
        return problem;
    }
}
